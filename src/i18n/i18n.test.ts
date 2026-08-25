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

  it("uses the approved native headline in every locale", () => {
    const headlineByLocale = {
      en: ["Your words,", "ready at the cursor."],
      "zh-TW": ["用說的，", "寫得更清楚。"],
      "zh-CN": ["直接说，", "写得更清楚。"],
      ja: ["話すだけで、", "伝わる文章に。"],
    } as const;
    const metadataByLocale = {
      en: [
        "ultrspeak — Private, Offline Voice Dictation for Mac and Windows",
        "Private voice dictation for Mac and Windows. Turn English or Mandarin speech into clear text at your cursor, on-device and offline.",
      ],
      "zh-TW": [
        "ultrspeak — 私密離線語音輸入，Mac 與 Windows 適用",
        "適用於 Mac 與 Windows 的裝置端語音輸入。支援英文與華語，離線也能將語音整理成清楚文字，直接輸入游標所在位置。",
      ],
      "zh-CN": [
        "ultrspeak — 私密离线语音输入，Mac 与 Windows 适用",
        "适用于 Mac 与 Windows 的本地语音输入。支持英语和普通话，离线也能将语音整理成清晰文字，直接输入光标所在位置。",
      ],
      ja: [
        "ultrspeak — プライベートでオフラインの音声入力、Mac・Windows 対応",
        "Mac・Windows向けのオンデバイス音声入力。英語と中国語（普通話）の音声をカーソル位置で整った文章に。オフラインでも使えます。",
      ],
    } as const;

    for (const locale of locales) {
      expect([
        translations[locale].hero.title,
        translations[locale].hero.titleAccent,
      ]).toEqual(headlineByLocale[locale]);
      expect([
        translations[locale].meta.home.title,
        translations[locale].meta.home.description,
      ]).toEqual(metadataByLocale[locale]);
    }
  });

  it("keeps the exact localized Free pricing allowance", () => {
    const pricingAllowanceByLocale = {
      en: "Up to 8,000 words per week",
      "zh-TW": "每週可免費輸入 8,000 字詞",
      "zh-CN": "每周可免费输入 8,000 字词",
      ja: "週8,000語まで無料",
    } as const;
    const formerAllowanceByLocale = {
      en: /2,000|\b(?:a|per) day\b/iu,
      "zh-TW": /2,000|每天|每日|每周/u,
      "zh-CN": /2,000|每天|每日|每週/u,
      ja: /2,000|1日|日あたり/u,
    } as const;

    for (const locale of locales) {
      const hero = translations[locale].hero;
      const pricingAllowances = translations[locale].pricing.freeFeatures.filter((feature) =>
        feature.includes("8,000"),
      );
      expect(hero).not.toHaveProperty("trialBefore");
      expect(hero).not.toHaveProperty("trialAfter");
      expect(pricingAllowances).toEqual([pricingAllowanceByLocale[locale]]);
      expect(pricingAllowances[0]).not.toMatch(formerAllowanceByLocale[locale]);
      expect(JSON.stringify(translations[locale])).not.toContain("2,000");
    }
  });

  it("removes retired slogans and unsupported homepage claims", () => {
    const retiredCopy = [
      "Speak. It's already written.",
      "Stop typing.",
      "Start speaking.",
      "開口說，文字已完成。",
      "開口說。",
      "文字已經寫好。",
      "別再打字。",
      "開始用說的。",
      "开口说，文字已完成。",
      "开口说。",
      "文字已经写好。",
      "别再打字。",
      "开始用说的。",
      "話せば、もう書けている。",
      "話せば、",
      "もう書けている。",
      "タイピングをやめて、",
      "話し始めよう。",
    ];

    for (const locale of locales) {
      const t = translations[locale];
      const homepagePositioning = [
        t.meta.home.title,
        t.meta.home.description,
        t.hero.eyebrow,
        t.hero.title,
        t.hero.titleAccent,
        t.hero.body,
        t.features.cards[1].title,
        t.features.cards[1].body,
        t.integrations.eyebrow,
        t.integrations.title,
        t.integrations.intro,
        t.how.steps[0].title,
        t.how.steps[0].body,
        t.footer.title,
        t.footer.titleAccent,
        t.footer.intro,
      ].join(" ");

      for (const retired of retiredCopy) {
        expect(homepagePositioning).not.toContain(retired);
      }
      expect(homepagePositioning).not.toMatch(
        /perfect(?:ly)?\s+(?:formatted\s+)?text|(?:3|three)\s*(?:x|×|times?)\s*(?:as\s+)?fast(?:er)?|3\s*倍|三倍/iu,
      );
      expect(homepagePositioning).not.toMatch(
        /any text field|every app|from any app|works everywhere|hold a key, anywhere|if you can type in it|任何文字欄位|每個應用程式|無論在哪個應用程式|隨處按住按鍵就能說|能打字的地方|任何文本框|每个应用程序|无论在哪个应用程序|随处按住按键就能说|あらゆるテキスト欄|どのアプリでも|どのアプリからでも|どこでもキーを押して話すだけ|文字を打てる場所なら/iu,
      );
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

  it("keeps the language selector compact and accessibly named", () => {
    const source = readFileSync(
      new URL("../components/Nav.astro", import.meta.url),
      "utf8",
    );
    const summary =
      source.match(
        /<summary\b(?=[^>]*\bdata-language-trigger(?:\s|=|>))[\s\S]*?<\/summary>/u,
      )?.[0] ?? "";
    const summaryContent = summary.slice(
      summary.indexOf(">") + 1,
      summary.lastIndexOf("</summary>"),
    );

    expect(source).toContain("<details");
    expect(summary).toContain("data-language-trigger");
    expect(summary).toContain(
      'aria-label={`${t.nav.language}: ${localeConfig[locale].label}`}',
    );
    expect(summaryContent).toContain("{localeConfig[locale].shortLabel}");
    expect(summaryContent).not.toContain("{t.nav.language}");
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
