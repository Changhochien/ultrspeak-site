import { describe, expect, it } from "vitest";

import {
  default as worker,
  parseReleaseManifest,
  parseSingleByteRange,
  resolveDownloadRoute,
  resolveUpdateObjectRoute,
  resolveTestUpdateObjectKey,
  sanitizeDownloadSource,
} from "./index";

function workerEnv(content: string, contentType: string): Env {
  const bytes = new TextEncoder().encode(content);
  const metadata = {
    size: bytes.byteLength,
    httpEtag: '"fixture-etag"',
    writeHttpMetadata(headers: Headers) {
      headers.set("Content-Type", contentType);
    },
  };
  return {
    ASSETS: {
      fetch: () => Promise.resolve(new Response("asset fallback")),
    },
    RELEASES: {
      head: () => Promise.resolve(metadata),
      get: (
        _key: string,
        options?: { readonly range?: { readonly offset: number; readonly length: number } },
      ) => {
        const range = options?.range;
        const body =
          range === undefined
            ? bytes
            : bytes.slice(range.offset, range.offset + range.length);
        return Promise.resolve({ ...metadata, body });
      },
    },
  } as unknown as Env;
}

describe("download source sanitization", () => {
  it("accepts short placement identifiers", () => {
    expect(sanitizeDownloadSource("Footer_Mac")).toBe("footer_mac");
  });

  it("does not retain arbitrary query data", () => {
    expect(sanitizeDownloadSource("https://example.com/private")).toBe("other");
    expect(sanitizeDownloadSource(null)).toBe("direct");
  });
});

describe("download routing", () => {
  it("keeps stable and test manifests in separate channels", () => {
    expect(resolveDownloadRoute("/download/macos")).toEqual({
      platform: "macos",
      channel: "stable",
    });
    expect(resolveDownloadRoute("/download/macos-test")).toEqual({
      platform: "macos",
      channel: "test",
    });
  });

  it("does not expose an unsupported Windows test lane", () => {
    expect(resolveDownloadRoute("/download/windows-test")).toBeNull();
    expect(resolveDownloadRoute("/download/macos-preview")).toBeNull();
  });
});

describe("release manifest validation", () => {
  it("accepts a versioned object inside the platform release prefix", () => {
    expect(
      parseReleaseManifest(
        {
          version: "0.1.0",
          objectKey: "macos/stable/releases/Ultrspeak-0.1.0-universal.dmg",
          fileName: "Ultrspeak-0.1.0-universal.dmg",
          contentType: "application/x-apple-diskimage",
          sha256:
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        "macos",
      ),
    ).toEqual({
      version: "0.1.0",
      objectKey: "macos/stable/releases/Ultrspeak-0.1.0-universal.dmg",
      fileName: "Ultrspeak-0.1.0-universal.dmg",
      contentType: "application/x-apple-diskimage",
      sha256:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    });
  });

  it("rejects cross-platform and traversal object keys", () => {
    const base = {
      version: "0.1.0",
      fileName: "Ultrspeak-0.1.0.dmg",
      contentType: "application/x-apple-diskimage",
    };
    expect(
      parseReleaseManifest(
        {
          ...base,
          objectKey: "windows/stable/releases/Ultrspeak-0.1.0.dmg",
        },
        "macos",
      ),
    ).toBeNull();
    expect(
      parseReleaseManifest(
        {
          ...base,
          objectKey: "macos/stable/releases/../private.key",
        },
        "macos",
      ),
    ).toBeNull();
  });

  it("accepts an isolated test-channel artifact only when requested", () => {
    const manifest = {
      version: "0.1.1-test.1",
      objectKey: "macos/test/releases/Ultrwispr-0.1.1-test.1.dmg",
      fileName: "Ultrwispr-0.1.1-test.1.dmg",
      contentType: "application/x-apple-diskimage",
    };
    expect(parseReleaseManifest(manifest, "macos", "test")).toEqual(manifest);
    expect(parseReleaseManifest(manifest, "macos")).toBeNull();
  });
});

describe("test update object routing", () => {
  it("maps the appcast and safe versioned artifacts into the test prefix", () => {
    expect(
      resolveTestUpdateObjectKey("/updates/macos/test/appcast.xml"),
    ).toBe("macos/test/appcast.xml");
    expect(
      resolveTestUpdateObjectKey(
        "/updates/macos/test/releases/Ultrwispr-0.1.1-test.1.dmg",
      ),
    ).toBe("macos/test/releases/Ultrwispr-0.1.1-test.1.dmg");
  });

  it("rejects traversal, nested paths, and non-test channels", () => {
    expect(
      resolveTestUpdateObjectKey(
        "/updates/macos/test/releases/../private.key",
      ),
    ).toBeNull();
    expect(
      resolveTestUpdateObjectKey(
        "/updates/macos/test/releases/nested/Ultrwispr.dmg",
      ),
    ).toBeNull();
    expect(
      resolveTestUpdateObjectKey("/updates/macos/stable/appcast.xml"),
    ).toBeNull();
  });
});

describe("host-independent update aliases", () => {
  it("maps new and retained aliases to the same stable object", () => {
    expect(
      resolveUpdateObjectRoute("/updates/macos/stable/appcast.xml"),
    ).toEqual({
      objectKey: "macos/stable/appcast.xml",
      channel: "stable",
      isAppcast: true,
    });
    expect(resolveUpdateObjectRoute("/macos/stable/appcast.xml")).toEqual({
      objectKey: "macos/stable/appcast.xml",
      channel: "stable",
      isAppcast: true,
    });
  });

  it("preserves canary and beta production aliases", () => {
    expect(
      resolveUpdateObjectRoute(
        "/macos/canary/releases/Ultrwispr-0.2.0-canary.1.dmg",
      ),
    ).toEqual({
      objectKey:
        "macos/canary/releases/Ultrwispr-0.2.0-canary.1.dmg",
      channel: "canary",
      isAppcast: false,
    });
    expect(
      resolveUpdateObjectRoute(
        "/updates/macos/beta/releases/Ultrwispr-0.2.0-beta.1.html",
      ),
    ).toEqual({
      objectKey:
        "macos/beta/releases/Ultrwispr-0.2.0-beta.1.html",
      channel: "beta",
      isAppcast: false,
    });
  });

  it("rejects traversal, private metadata, nested paths, and unknown channels", () => {
    for (const path of [
      "/updates/macos/stable/releases/../private.key",
      "/updates/macos/stable/releases/release-metadata.json",
      "/updates/macos/stable/releases/Ultrwispr-1.0.0.sha256",
      "/updates/macos/stable/releases/nested/Ultrwispr.dmg",
      "/updates/macos/nightly/appcast.xml",
    ]) {
      expect(resolveUpdateObjectRoute(path)).toBeNull();
    }
  });
});

describe("update range parsing", () => {
  it("supports bounded, open-ended, and suffix byte ranges", () => {
    expect(parseSingleByteRange("bytes=0-99", 1000)).toEqual({
      offset: 0,
      length: 100,
    });
    expect(parseSingleByteRange("bytes=900-", 1000)).toEqual({
      offset: 900,
      length: 100,
    });
    expect(parseSingleByteRange("bytes=-25", 1000)).toEqual({
      offset: 975,
      length: 25,
    });
  });

  it("distinguishes no range from malformed or unsatisfiable ranges", () => {
    expect(parseSingleByteRange(null, 1000)).toBeUndefined();
    expect(parseSingleByteRange("bytes=1000-", 1000)).toBeNull();
    expect(parseSingleByteRange("bytes=10-1", 1000)).toBeNull();
    expect(parseSingleByteRange("bytes=0-1,4-5", 1000)).toBeNull();
  });
});

describe("update asset responses", () => {
  it("serves HEAD appcast metadata with low-cache headers", async () => {
    const response = await worker.fetch(
      new Request("https://worker.example/updates/macos/stable/appcast.xml", {
        method: "HEAD",
      }),
      workerEnv("<rss />", "application/octet-stream"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-cache, max-age=60");
    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
    expect(response.headers.get("Accept-Ranges")).toBe("none");
    expect(await response.text()).toBe("");
  });

  it("serves one immutable byte range with 206 metadata", async () => {
    const response = await worker.fetch(
      new Request(
        "https://worker.example/macos/stable/releases/Ultrwispr-1.0.0.dmg",
        { headers: { Range: "bytes=2-5" } },
      ),
      workerEnv("0123456789", "application/x-apple-diskimage"),
    );
    expect(response.status).toBe(206);
    expect(response.headers.get("Content-Range")).toBe("bytes 2-5/10");
    expect(response.headers.get("Content-Length")).toBe("4");
    expect(response.headers.get("Cache-Control")).toBe(
      "public, max-age=31536000, immutable",
    );
    expect(await response.text()).toBe("2345");
  });

  it("reads mutable appcast body and metadata atomically", async () => {
    let headCalls = 0;
    const fresh = new TextEncoder().encode("<rss>fresh</rss>");
    const env = {
      ASSETS: {
        fetch: () => Promise.resolve(new Response("asset fallback")),
      },
      RELEASES: {
        head: () => {
          headCalls += 1;
          return Promise.resolve({
            size: 1,
            httpEtag: '"stale"',
            writeHttpMetadata() {},
          });
        },
        get: () =>
          Promise.resolve({
            size: fresh.byteLength,
            httpEtag: '"fresh"',
            body: fresh,
            writeHttpMetadata() {},
          }),
      },
    } as unknown as Env;
    const response = await worker.fetch(
      new Request("https://worker.example/updates/macos/stable/appcast.xml"),
      env,
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("ETag")).toBe('"fresh"');
    expect(response.headers.get("Content-Length")).toBe(
      String(fresh.byteLength),
    );
    expect(await response.text()).toBe("<rss>fresh</rss>");
    expect(headCalls).toBe(0);
  });

  it("honors weak appcast ETag revalidation and ignores appcast ranges safely", async () => {
    const env = workerEnv("<rss>fresh</rss>", "application/xml");
    const notModified = await worker.fetch(
      new Request("https://worker.example/updates/macos/stable/appcast.xml", {
        headers: { "If-None-Match": 'W/"fixture-etag"' },
      }),
      env,
    );
    expect(notModified.status).toBe(304);

    const full = await worker.fetch(
      new Request("https://worker.example/updates/macos/stable/appcast.xml", {
        headers: { Range: "bytes=0-1" },
      }),
      env,
    );
    expect(full.status).toBe(200);
    expect(full.headers.get("Content-Range")).toBeNull();
    expect(await full.text()).toBe("<rss>fresh</rss>");
  });

  it("returns the full current object when If-Range is stale", async () => {
    const response = await worker.fetch(
      new Request(
        "https://worker.example/macos/stable/releases/Ultrwispr-1.0.0.dmg",
        {
          headers: {
            Range: "bytes=2-5",
            "If-Range": '"older-etag"',
          },
        },
      ),
      workerEnv("0123456789", "application/x-apple-diskimage"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Range")).toBeNull();
    expect(response.headers.get("Content-Length")).toBe("10");
    expect(await response.text()).toBe("0123456789");
  });

  it("does not treat an If-Range wildcard as a strong validator", async () => {
    const response = await worker.fetch(
      new Request(
        "https://worker.example/macos/stable/releases/Ultrwispr-1.0.0.dmg",
        {
          headers: {
            Range: "bytes=2-5",
            "If-Range": "*",
          },
        },
      ),
      workerEnv("0123456789", "application/x-apple-diskimage"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Range")).toBeNull();
    expect(await response.text()).toBe("0123456789");
  });

  it("marks missing update objects as Worker-routed origin probes", async () => {
    const env = {
      ASSETS: {
        fetch: () => Promise.resolve(new Response("asset fallback")),
      },
      RELEASES: {
        head: () => Promise.resolve(null),
        get: () => Promise.resolve(null),
      },
    } as unknown as Env;
    const response = await worker.fetch(
      new Request(
        "https://worker.example/updates/macos/test/releases/ultrwispr-origin-probe.dmg",
      ),
      env,
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("X-Ultrspeak-Update-Route")).toBe("1");
  });

  it("sandboxes public HTML release notes", async () => {
    const response = await worker.fetch(
      new Request(
        "https://worker.example/updates/macos/stable/releases/Ultrwispr-1.0.0.html",
      ),
      workerEnv("<h1>Notes</h1>", "text/html; charset=utf-8"),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Security-Policy")).toContain(
      "default-src 'none'",
    );
    expect(response.headers.get("Content-Security-Policy")).not.toContain(
      "https:",
    );
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
  });

  it("returns 416 for an unsatisfiable update range", async () => {
    const response = await worker.fetch(
      new Request(
        "https://worker.example/updates/macos/test/releases/Ultrwispr-1.0.0.dmg",
        { headers: { Range: "bytes=100-" } },
      ),
      workerEnv("0123456789", "application/x-apple-diskimage"),
    );
    expect(response.status).toBe(416);
    expect(response.headers.get("Content-Range")).toBe("bytes */10");
  });
});
