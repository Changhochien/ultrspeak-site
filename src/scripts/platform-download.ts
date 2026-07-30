export type DownloadPlatform = "macos" | "windows" | "other";

export interface PlatformHints {
  readonly userAgent?: string;
  readonly platform?: string;
  readonly userAgentDataPlatform?: string;
  readonly maxTouchPoints?: number;
}

const downloadPathByPlatform = {
  macos: "/download/macos-test",
  windows: "/download/windows",
} as const;

export function detectDownloadPlatform(
  hints: PlatformHints,
): DownloadPlatform {
  const userAgent = hints.userAgent?.toLowerCase() ?? "";
  const platform = [
    hints.userAgentDataPlatform,
    hints.platform,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .toLowerCase();

  const isMobileAppleDevice =
    /iphone|ipad|ipod/u.test(userAgent) ||
    (platform.includes("mac") && (hints.maxTouchPoints ?? 0) > 1);
  if (isMobileAppleDevice) return "other";

  if (platform.includes("win") || userAgent.includes("windows")) {
    return "windows";
  }
  if (platform.includes("mac") || userAgent.includes("macintosh")) {
    return "macos";
  }
  return "other";
}

export function getDownloadHref(
  platform: DownloadPlatform,
  source: string,
): string | undefined {
  if (platform === "other") return undefined;
  return `${downloadPathByPlatform[platform]}?source=${encodeURIComponent(source)}`;
}
