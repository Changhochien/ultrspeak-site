import { describe, expect, it } from "vitest";

import {
  detectDownloadPlatform,
  getDownloadHref,
} from "./platform-download";

describe("download platform detection", () => {
  it("prefers the browser's user-agent client hint for macOS", () => {
    expect(
      detectDownloadPlatform({
        userAgentDataPlatform: "macOS",
        platform: "MacIntel",
      }),
    ).toBe("macos");
  });

  it("detects Windows from either platform or user agent data", () => {
    expect(detectDownloadPlatform({ platform: "Win32" })).toBe("windows");
    expect(
      detectDownloadPlatform({
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      }),
    ).toBe("windows");
  });

  it("does not recommend a desktop installer to iPadOS", () => {
    expect(
      detectDownloadPlatform({
        userAgent:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) Version/17.0 Mobile/15E148 Safari/604.1",
        platform: "MacIntel",
        maxTouchPoints: 5,
      }),
    ).toBe("other");
  });

  it("keeps Linux and unknown clients neutral", () => {
    expect(detectDownloadPlatform({ platform: "Linux x86_64" })).toBe(
      "other",
    );
    expect(detectDownloadPlatform({})).toBe("other");
  });

  it("maps supported platforms to the current download routes", () => {
    expect(getDownloadHref("macos", "hero_macos")).toBe(
      "/download/macos-test?source=hero_macos",
    );
    expect(getDownloadHref("windows", "hero_windows")).toBe(
      "/download/windows?source=hero_windows",
    );
    expect(getDownloadHref("other", "hero")).toBeUndefined();
  });
});
