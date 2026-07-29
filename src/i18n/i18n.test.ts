import { describe, expect, it } from "vitest";
import { locales, publicRoutes } from "./config";
import { translations } from "./ui";
import {
  getAbsoluteLocalizedUrl,
  getAlternateLinks,
  getLocaleSwitchPath,
  getLocalizedPath,
  getRouteFromPathname,
} from "./utils";

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") return [prefix];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      leafPaths(item, `${prefix}[${index}]`),
    );
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      leafPaths(item, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [];
}

describe("translation dictionaries", () => {
  it("contain the same non-empty string leaves for every locale", () => {
    const englishPaths = leafPaths(translations.en);

    for (const locale of locales) {
      expect(leafPaths(translations[locale])).toEqual(englishPaths);
      for (const path of englishPaths) {
        const value = path
          .replaceAll("[", ".")
          .replaceAll("]", "")
          .split(".")
          .reduce<unknown>(
            (current, key) =>
              current && typeof current === "object"
                ? (current as Record<string, unknown>)[key]
                : undefined,
            translations[locale],
          );
        expect(value, `${locale}:${path}`).toBeTypeOf("string");
        expect((value as string).trim(), `${locale}:${path}`).not.toBe("");
      }
    }
  });
});

describe("localized route helpers", () => {
  it("keeps English unprefixed and prefixes translated locales", () => {
    expect(getLocalizedPath("en", "home")).toBe("/");
    expect(getLocalizedPath("en", "privacy")).toBe("/privacy");
    expect(getLocalizedPath("zh-TW", "privacy")).toBe("/zh-tw/privacy");
    expect(getLocalizedPath("zh-CN", "contact")).toBe("/zh-cn/contact");
    expect(getLocalizedPath("ja", "success")).toBe("/ja/success");
  });

  it("recognizes all public localized routes and falls unknown paths home", () => {
    for (const route of publicRoutes) {
      for (const locale of locales) {
        expect(getRouteFromPathname(getLocalizedPath(locale, route))).toBe(
          route,
        );
      }
    }
    expect(getRouteFromPathname("/unknown/path")).toBe("home");
    expect(getRouteFromPathname("/zh-cn/unknown")).toBe("home");
    expect(getRouteFromPathname("/ja/privacy/unknown")).toBe("home");
  });

  it("preserves hashes when switching locale", () => {
    expect(getLocaleSwitchPath("ja", "/zh-tw/", "", "#pricing")).toBe(
      "/ja#pricing",
    );
    expect(
      getLocaleSwitchPath(
        "zh-CN",
        "/privacy",
        "?source=checkout",
        "#details",
      ),
    ).toBe(
      "/zh-cn/privacy?source=checkout#details",
    );
  });

  it("creates reciprocal canonical and hreflang URLs", () => {
    expect(
      getAbsoluteLocalizedUrl(
        "https://ultrspeak.com",
        "zh-TW",
        "terms",
      ).toString(),
    ).toBe("https://ultrspeak.com/zh-tw/terms");

    const links = getAlternateLinks(
      "https://ultrspeak.com",
      "privacy",
    );
    expect(links.map((link) => link.hreflang)).toEqual([
      "en",
      "zh-TW",
      "zh-CN",
      "ja",
      "x-default",
    ]);
    expect(links.at(-1)?.href).toBe("https://ultrspeak.com/privacy");
  });
});
