import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";
import { localeConfig, locales, publicRoutes } from "./config";
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

  it("provides compact, visible locale labels for the navigation control", () => {
    for (const locale of locales) {
      expect(localeConfig[locale].label.trim()).not.toBe("");
      expect(localeConfig[locale].shortLabel.trim()).not.toBe("");
      expect(localeConfig[locale].shortLabel.length).toBeLessThanOrEqual(4);
    }
  });

  it("describes an email-draft workflow without claiming server delivery", () => {
    for (const locale of locales) {
      const contact = translations[locale].contact;
      expect(contact.draftGuidance).toMatch(/email|郵件|邮件|メール/u);
      expect(contact.draftOpened).toMatch(/not sent|尚未傳送|尚未发送|送信されていません/u);
      expect(contact.fallbackIntro).toContain("hello@ultrspeak.com");
      expect(contact.copySuccess).toContain("hello@ultrspeak.com");
    }
  });

  it("provides locale-specific copyright notices", () => {
    expect(translations.en.footer.copyright).toBe(
      "© {year} ultrspeak. All rights reserved.",
    );
    expect(translations["zh-TW"].footer.copyright).toBe(
      "© {year} ultrspeak。保留一切權利。",
    );
    expect(translations["zh-CN"].footer.copyright).toBe(
      "© {year} ultrspeak。保留所有权利。",
    );
    expect(translations.ja.footer.copyright).toBe(
      "© {year} ultrspeak. すべての権利を保有します。",
    );
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

describe("release-critical component wiring", () => {
  it("uses direct email instead of a placeholder network submission", () => {
    const source = readFileSync(
      new URL("../components/pages/ContactPage.astro", import.meta.url),
      "utf8",
    );

    expect(source).toContain("mailto:");
    expect(source).toContain("hello@ultrspeak.com");
    expect(source).toContain("copy-contact-draft");
    expect(source).not.toContain("formspree");
    expect(source).not.toContain("fetch(");
    expect(source).not.toContain("your-form-id");
  });

  it("renders all locale choices as accessible navigation links", () => {
    const source = readFileSync(
      new URL("../components/Nav.astro", import.meta.url),
      "utf8",
    );

    expect(source).toContain("<details");
    expect(source).toContain("<summary");
    expect(source).toContain("data-language-link");
    expect(source).toContain("aria-current");
  });

  it("preserves the active query and fragment when switching locales", () => {
    const source = readFileSync(
      new URL("../layouts/Base.astro", import.meta.url),
      "utf8",
    );

    expect(source).toContain("destination.search = window.location.search");
    expect(source).toContain("destination.hash = window.location.hash");
  });

  it("keeps the copied email draft complete and guards protocol failures", () => {
    const source = readFileSync(
      new URL("../components/pages/ContactPage.astro", import.meta.url),
      "utf8",
    );

    expect(source).toContain("data-recipient-label");
    expect(source).toContain("data-subject-label");
    expect(source).toContain("mailtoUrl.length > 1800");
    expect(source).toContain("window.location.assign(mailtoUrl)");
    expect(source).toContain("document.execCommand");
  });
});
