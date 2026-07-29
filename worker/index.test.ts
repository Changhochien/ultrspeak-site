import { describe, expect, it } from "vitest";

import { parseReleaseManifest, sanitizeDownloadSource } from "./index";

describe("download source sanitization", () => {
  it("accepts short placement identifiers", () => {
    expect(sanitizeDownloadSource("Footer_Mac")).toBe("footer_mac");
  });

  it("does not retain arbitrary query data", () => {
    expect(sanitizeDownloadSource("https://example.com/private")).toBe("other");
    expect(sanitizeDownloadSource(null)).toBe("direct");
  });
});

describe("release manifest validation", () => {
  it("accepts a versioned object inside the platform release prefix", () => {
    expect(
      parseReleaseManifest(
        {
          version: "0.1.0",
          objectKey:
            "downloads/macos/stable/releases/Ultrspeak-0.1.0-universal.dmg",
          fileName: "Ultrspeak-0.1.0-universal.dmg",
          contentType: "application/x-apple-diskimage",
          sha256:
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        },
        "macos",
      ),
    ).toEqual({
      version: "0.1.0",
      objectKey:
        "downloads/macos/stable/releases/Ultrspeak-0.1.0-universal.dmg",
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
          objectKey:
            "downloads/windows/stable/releases/Ultrspeak-0.1.0.dmg",
        },
        "macos",
      ),
    ).toBeNull();
    expect(
      parseReleaseManifest(
        {
          ...base,
          objectKey: "downloads/macos/stable/releases/../private.key",
        },
        "macos",
      ),
    ).toBeNull();
  });
});
