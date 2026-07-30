import { describe, expect, it } from "vitest";

import {
  parseReleaseManifest,
  resolveDownloadRoute,
  resolveTestUpdateObjectKey,
  sanitizeDownloadSource,
} from "./index";

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
