const SUPPORTED_PLATFORMS = ["macos", "windows"] as const;
const RELEASE_CHANNELS = ["stable", "test"] as const;
const MAX_MANIFEST_BYTES = 4096;
const MAX_SOURCE_LENGTH = 48;

type Platform = (typeof SUPPORTED_PLATFORMS)[number];
type ReleaseChannel = (typeof RELEASE_CHANNELS)[number];
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

export function resolveTestUpdateObjectKey(pathname: string): string | null {
  if (pathname === "/updates/macos/test/appcast.xml") {
    return "macos/test/appcast.xml";
  }

  const releaseMatch =
    /^\/updates\/macos\/test\/releases\/([0-9A-Za-z][0-9A-Za-z._+()-]{0,159})$/u.exec(
      pathname,
    );
  const fileName = releaseMatch?.[1];
  if (fileName === undefined || !isSafeFileName(fileName)) return null;
  return `macos/test/releases/${fileName}`;
}

async function handleTestUpdateAsset(
  request: Request,
  env: Env,
  objectKey: string,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return methodNotAllowedResponse();
  }

  const object = await env.RELEASES.get(objectKey);
  if (object === null) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  const isAppcast = objectKey.endsWith("/appcast.xml");
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set(
    "Cache-Control",
    isAppcast
      ? "no-cache, max-age=60"
      : "public, max-age=31536000, immutable",
  );
  headers.set("Content-Length", String(object.size));
  headers.set(
    "Content-Type",
    isAppcast
      ? "application/xml; charset=utf-8"
      : (headers.get("Content-Type") ?? "application/octet-stream"),
  );
  headers.set("ETag", object.httpEtag);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Robots-Tag", "noindex");

  return new Response(request.method === "HEAD" ? null : object.body, {
    status: 200,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const updateObjectKey = resolveTestUpdateObjectKey(url.pathname);
    if (updateObjectKey !== null) {
      try {
        return await handleTestUpdateAsset(request, env, updateObjectKey);
      } catch (error) {
        console.error(
          JSON.stringify({
            message: "test update request failed",
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
