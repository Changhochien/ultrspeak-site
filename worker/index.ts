const SUPPORTED_PLATFORMS = ["macos", "windows"] as const;
const RELEASE_CHANNEL = "stable" as const;
const MAX_MANIFEST_BYTES = 4096;
const MAX_SOURCE_LENGTH = 48;

type Platform = (typeof SUPPORTED_PLATFORMS)[number];
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

function manifestKey(platform: Platform): string {
  return `downloads/${platform}/${RELEASE_CHANNEL}/latest.json`;
}

function releasePrefix(platform: Platform): string {
  return `${platform}/${RELEASE_CHANNEL}/releases/`;
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
    !objectKey.startsWith(releasePrefix(platform)) ||
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
      channel: RELEASE_CHANNEL,
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
): Promise<ReleaseManifest | null> {
  const object = await env.RELEASES.get(manifestKey(platform));
  if (object === null || object.size > MAX_MANIFEST_BYTES) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(await object.text()) as unknown;
  } catch {
    return null;
  }
  return parseReleaseManifest(parsed, platform);
}

async function handleDownload(
  request: Request,
  env: Env,
  platform: Platform,
): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return methodNotAllowedResponse();
  }

  const source = sanitizeDownloadSource(
    new URL(request.url).searchParams.get("source"),
  );
  const manifest = await readManifest(env, platform);
  if (manifest === null) {
    if (request.method === "GET") {
      recordDownloadEvent({
        platform,
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const match = /^\/download\/([^/]+)\/?$/u.exec(url.pathname);
    if (match === null || match[1] === undefined || !isPlatform(match[1])) {
      return env.ASSETS.fetch(request);
    }

    try {
      return await handleDownload(request, env, match[1]);
    } catch (error) {
      if (request.method === "GET") {
        recordDownloadEvent({
          platform: match[1],
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
