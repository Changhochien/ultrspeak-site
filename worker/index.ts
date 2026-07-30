const SUPPORTED_PLATFORMS = ["macos", "windows"] as const;
const RELEASE_CHANNELS = ["stable", "test"] as const;
const UPDATE_CHANNELS = ["stable", "beta", "canary", "test"] as const;
const MAX_MANIFEST_BYTES = 4096;
const MAX_SOURCE_LENGTH = 48;

type Platform = (typeof SUPPORTED_PLATFORMS)[number];
type ReleaseChannel = (typeof RELEASE_CHANNELS)[number];
type UpdateChannel = (typeof UPDATE_CHANNELS)[number];
type DownloadOutcome = "available" | "unavailable" | "error";

interface ReleaseManifest {
  readonly version: string;
  readonly objectKey: string;
  readonly fileName: string;
  readonly contentType: string;
  readonly sha256?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPlatform(value: string): value is Platform {
  return SUPPORTED_PLATFORMS.some((platform) => platform === value);
}

export function resolveDownloadRoute(
  pathname: string,
): { readonly platform: Platform; readonly channel: ReleaseChannel } | null {
  const match = /^\/download\/(macos|windows)(-test)?\/?$/u.exec(pathname);
  const platform = match?.[1];
  if (platform === undefined || !isPlatform(platform)) return null;

  const channel: ReleaseChannel = match?.[2] === "-test" ? "test" : "stable";
  if (channel === "test" && platform !== "macos") return null;
  return { platform, channel };
}

function manifestKey(
  platform: Platform,
  channel: ReleaseChannel,
): string {
  return `downloads/${platform}/${channel}/latest.json`;
}

function releasePrefix(
  platform: Platform,
  channel: ReleaseChannel,
): string {
  return `${platform}/${channel}/releases/`;
}

function isSafeVersion(value: string): boolean {
  return /^[0-9A-Za-z][0-9A-Za-z.+-]{0,63}$/u.test(value);
}

function isSafeFileName(value: string): boolean {
  return (
    value.length <= 160 &&
    /^[0-9A-Za-z][0-9A-Za-z._+()-]*$/u.test(value) &&
    !value.includes("..")
  );
}

function isSafeContentType(value: string): boolean {
  return /^(application|binary)\/[0-9A-Za-z.+-]{1,80}$/u.test(value);
}

function isSafeSha256(value: string): boolean {
  return /^[a-f0-9]{64}$/u.test(value);
}

export function parseReleaseManifest(
  value: unknown,
  platform: Platform,
  channel: ReleaseChannel = "stable",
): ReleaseManifest | null {
  if (!isRecord(value)) return null;

  const version = value.version;
  const objectKey = value.objectKey;
  const fileName = value.fileName;
  const contentType = value.contentType;
  const sha256 = value.sha256;

  if (
    typeof version !== "string" ||
    !isSafeVersion(version) ||
    typeof objectKey !== "string" ||
    !objectKey.startsWith(releasePrefix(platform, channel)) ||
    objectKey.includes("..") ||
    typeof fileName !== "string" ||
    !isSafeFileName(fileName) ||
    typeof contentType !== "string" ||
    !isSafeContentType(contentType) ||
    (sha256 !== undefined &&
      (typeof sha256 !== "string" || !isSafeSha256(sha256)))
  ) {
    return null;
  }

  return {
    version,
    objectKey,
    fileName,
    contentType,
    ...(sha256 === undefined ? {} : { sha256 }),
  };
}

export function sanitizeDownloadSource(value: string | null): string {
  if (value === null) return "direct";
  const normalized = value.trim().toLowerCase();
  if (
    normalized.length === 0 ||
    normalized.length > MAX_SOURCE_LENGTH ||
    !/^[a-z0-9_-]+$/u.test(normalized)
  ) {
    return "other";
  }
  return normalized;
}

function recordDownloadEvent(input: {
    readonly platform: Platform;
    readonly channel: ReleaseChannel;
    readonly version: string;
    readonly outcome: DownloadOutcome;
    readonly source: string;
  },
): void {
  // Ordered schema:
  // blob1 platform, blob2 channel, blob3 version, blob4 outcome,
  // blob5 source placement; double1 count; index1 platform.
  // Deliberately excludes IP address, user agent, referrer, and cookies.
  console.log(
    JSON.stringify({
      event: "download",
      platform: input.platform,
      channel: input.channel,
      version: input.version,
      outcome: input.outcome,
      source: input.source,
      count: 1,
    }),
  );
}

function unavailableResponse(
  platform: Platform,
  method: string,
): Response {
  const label = platform === "macos" ? "Mac" : "Windows";
  const body =
    method === "HEAD"
      ? null
      : `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${label} download is being prepared — ultrspeak</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { display:grid; min-height:100vh; margin:0; place-items:center; background:#f5f1e9; color:#27231f; }
      main { width:min(34rem, calc(100% - 3rem)); text-align:center; }
      a { color:#9a5d00; font-weight:700; }
    </style>
  </head>
  <body>
    <main>
      <h1>${label} download is being prepared.</h1>
      <p>The signed installer has not been promoted to the stable channel yet.</p>
      <p><a href="/">Return to ultrspeak</a></p>
    </main>
  </body>
</html>`;

  return new Response(body, {
    status: 503,
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": "text/html; charset=utf-8",
      "Retry-After": "3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function methodNotAllowedResponse(): Response {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: {
      Allow: "GET, HEAD",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function readManifest(
  env: Env,
  platform: Platform,
  channel: ReleaseChannel,
): Promise<ReleaseManifest | null> {
  const object = await env.RELEASES.get(manifestKey(platform, channel));
  if (object === null || object.size > MAX_MANIFEST_BYTES) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(await object.text()) as unknown;
  } catch {
    return null;
  }
  return parseReleaseManifest(parsed, platform, channel);
}

async function handleDownload(
  request: Request,
  env: Env,
  platform: Platform,
  channel: ReleaseChannel,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return methodNotAllowedResponse();
  }

  const source = sanitizeDownloadSource(
    new URL(request.url).searchParams.get("source"),
  );
  const manifest = await readManifest(env, platform, channel);
  if (manifest === null) {
    if (request.method === "GET") {
      recordDownloadEvent({
        platform,
        channel,
        version: "none",
        outcome: "unavailable",
        source,
      });
    }
    return unavailableResponse(platform, request.method);
  }

  const release = await env.RELEASES.get(manifest.objectKey);
  if (release === null) {
    if (request.method === "GET") {
      recordDownloadEvent({
        platform,
        channel,
        version: manifest.version,
        outcome: "unavailable",
        source,
      });
    }
    return unavailableResponse(platform, request.method);
  }

  if (request.method === "GET") {
    recordDownloadEvent({
      platform,
      channel,
      version: manifest.version,
      outcome: "available",
      source,
    });
  }

  const headers = new Headers();
  release.writeHttpMetadata(headers);
  headers.set("Cache-Control", "private, no-store");
  headers.set(
    "Content-Disposition",
    `attachment; filename="${manifest.fileName}"`,
  );
  headers.set("Content-Length", String(release.size));
  headers.set("Content-Type", manifest.contentType);
  headers.set("ETag", release.httpEtag);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Ultrspeak-Version", manifest.version);
  if (manifest.sha256 !== undefined) {
    headers.set("Digest", `sha-256=${manifest.sha256}`);
  }

  return new Response(request.method === "HEAD" ? null : release.body, {
    status: 200,
    headers,
  });
}

interface UpdateObjectRoute {
  readonly objectKey: string;
  readonly channel: UpdateChannel;
  readonly isAppcast: boolean;
}

export function resolveUpdateObjectRoute(
  pathname: string,
): UpdateObjectRoute | null {
  const match =
    /^\/(?:updates\/)?macos\/(stable|beta|canary|test)\/(appcast\.xml|releases\/([^/]+))$/u.exec(
      pathname,
    );
  const channel = match?.[1] as UpdateChannel | undefined;
  const suffix = match?.[2];
  if (
    channel === undefined ||
    suffix === undefined ||
    !UPDATE_CHANNELS.some((candidate) => candidate === channel)
  ) {
    return null;
  }
  if (suffix === "appcast.xml") {
    return {
      objectKey: `macos/${channel}/appcast.xml`,
      channel,
      isAppcast: true,
    };
  }
  const fileName = match?.[3];
  if (
    fileName === undefined ||
    !isSafeFileName(fileName) ||
    !/(?:\.dmg|\.html|\.dmg\.sha256)$/u.test(fileName)
  ) {
    return null;
  }
  return {
    objectKey: `macos/${channel}/releases/${fileName}`,
    channel,
    isAppcast: false,
  };
}

export function resolveTestUpdateObjectKey(pathname: string): string | null {
  const route = resolveUpdateObjectRoute(pathname);
  return route?.channel === "test" ? route.objectKey : null;
}

interface ByteRange {
  readonly offset: number;
  readonly length: number;
}

export function parseSingleByteRange(
  value: string | null,
  size: number,
): ByteRange | undefined | null {
  if (value === null) return undefined;
  const match = /^bytes=(\d*)-(\d*)$/u.exec(value.trim());
  if (match === null || value.includes(",") || size <= 0) return null;
  const startRaw = match[1] ?? "";
  const endRaw = match[2] ?? "";
  if (startRaw === "" && endRaw === "") return null;

  if (startRaw === "") {
    const suffix = Number(endRaw);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null;
    const length = Math.min(suffix, size);
    return { offset: size - length, length };
  }

  const start = Number(startRaw);
  const end = endRaw === "" ? size - 1 : Number(endRaw);
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    start >= size ||
    end < start
  ) {
    return null;
  }
  const boundedEnd = Math.min(end, size - 1);
  return { offset: start, length: boundedEnd - start + 1 };
}

function etagConditionMatches(
  value: string,
  etag: string,
  weakComparison: boolean,
): boolean {
  const normalize = (candidate: string): string =>
    weakComparison ? candidate.replace(/^W\//u, "") : candidate;
  return value
    .split(",")
    .map((candidate) => candidate.trim())
    .some(
      (candidate) =>
        candidate === "*" || normalize(candidate) === normalize(etag),
    );
}

function strongIfRangeMatches(value: string, etag: string): boolean {
  const candidate = value.trim();
  return (
    candidate !== "*" &&
    !candidate.startsWith("W/") &&
    !candidate.includes(",") &&
    candidate === etag
  );
}

async function handleUpdateAsset(
  request: Request,
  env: Env,
  route: UpdateObjectRoute,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return methodNotAllowedResponse();
  }

  const rangeHeader =
    request.method === "GET" && !route.isAppcast
      ? request.headers.get("Range")
      : null;
  const initialObject =
    request.method === "GET" && rangeHeader === null
      ? await env.RELEASES.get(route.objectKey)
      : null;
  const metadata =
    initialObject ?? (await env.RELEASES.head(route.objectKey));
  if (metadata === null) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Ultrspeak-Update-Route": "1",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  const ifMatch = request.headers.get("If-Match");
  if (
    ifMatch !== null &&
    !etagConditionMatches(ifMatch, metadata.httpEtag, false)
  ) {
    return new Response("Precondition Failed", {
      status: 412,
      headers: {
        "Cache-Control": "private, no-store",
        ETag: metadata.httpEtag,
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
  const ifNoneMatch = request.headers.get("If-None-Match");
  if (
    ifNoneMatch !== null &&
    etagConditionMatches(ifNoneMatch, metadata.httpEtag, true)
  ) {
    return new Response(null, {
      status: 304,
      headers: {
        "Cache-Control": route.isAppcast
          ? "no-cache, max-age=60"
          : "public, max-age=31536000, immutable",
        ETag: metadata.httpEtag,
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  const ifRange = request.headers.get("If-Range");
  const rangeAllowed =
    rangeHeader !== null &&
    (ifRange === null ||
      strongIfRangeMatches(ifRange, metadata.httpEtag));
  const requestedRange = rangeAllowed
    ? parseSingleByteRange(rangeHeader, metadata.size)
    : undefined;
  if (requestedRange === null) {
    return new Response("Range Not Satisfiable", {
      status: 416,
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes */${metadata.size}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  let object =
    request.method === "HEAD"
      ? null
      : (initialObject ??
        (await env.RELEASES.get(
          route.objectKey,
          requestedRange === undefined ? undefined : { range: requestedRange },
        )));
  if (request.method === "GET" && object === null) {
    return new Response("Update service unavailable", {
      status: 503,
      headers: {
        "Cache-Control": "private, no-store",
        "Retry-After": "300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
  const responseMetadata =
    requestedRange === undefined && object !== null ? object : metadata;

  const headers = new Headers();
  responseMetadata.writeHttpMetadata(headers);
  headers.set(
    "Cache-Control",
    route.isAppcast
      ? "no-cache, max-age=60"
      : "public, max-age=31536000, immutable",
  );
  headers.set("Accept-Ranges", route.isAppcast ? "none" : "bytes");
  headers.set(
    "Content-Length",
    String(requestedRange?.length ?? responseMetadata.size),
  );
  headers.set(
    "Content-Type",
    route.isAppcast
      ? "application/xml; charset=utf-8"
      : (headers.get("Content-Type") ?? "application/octet-stream"),
  );
  headers.set("ETag", responseMetadata.httpEtag);
  headers.set("X-Ultrspeak-Update-Route", "1");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Robots-Tag", "noindex");
  if (!route.isAppcast && route.objectKey.endsWith(".html")) {
    headers.set(
      "Content-Security-Policy",
      "sandbox; default-src 'none'; img-src data:; style-src 'unsafe-inline'",
    );
  }
  if (requestedRange !== undefined) {
    const end = requestedRange.offset + requestedRange.length - 1;
    headers.set(
      "Content-Range",
      `bytes ${requestedRange.offset}-${end}/${responseMetadata.size}`,
    );
  }

  return new Response(request.method === "HEAD" ? null : object?.body, {
    status: requestedRange === undefined ? 200 : 206,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const updateRoute = resolveUpdateObjectRoute(url.pathname);
    if (updateRoute !== null) {
      try {
        return await handleUpdateAsset(request, env, updateRoute);
      } catch (error) {
        console.error(
          JSON.stringify({
            message: "update request failed",
            path: url.pathname,
            error: error instanceof Error ? error.message : "unknown",
          }),
        );
        return new Response("Update service unavailable", {
          status: 503,
          headers: {
            "Cache-Control": "private, no-store",
            "Retry-After": "300",
            "X-Content-Type-Options": "nosniff",
          },
        });
      }
    }

    const downloadRoute = resolveDownloadRoute(url.pathname);
    if (downloadRoute === null) {
      return env.ASSETS.fetch(request);
    }
    const { platform, channel } = downloadRoute;

    try {
      return await handleDownload(request, env, platform, channel);
    } catch (error) {
      if (request.method === "GET") {
        recordDownloadEvent({
          platform,
          channel,
          version: "unknown",
          outcome: "error",
          source: sanitizeDownloadSource(url.searchParams.get("source")),
        });
      }
      console.error(
        JSON.stringify({
          message: "download request failed",
          path: url.pathname,
          error: error instanceof Error ? error.message : "unknown",
        }),
      );
      return new Response("Download service unavailable", {
        status: 503,
        headers: {
          "Cache-Control": "private, no-store",
          "Retry-After": "300",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }
  },
} satisfies ExportedHandler<Env>;
