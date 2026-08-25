import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputRoot = fileURLToPath(new URL("../dist/", import.meta.url));

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? collectHtmlFiles(path)
        : entry.name.endsWith(".html")
          ? [path]
          : [];
    }),
  );
  return files.flat();
}

function assert(condition, message) {
  if (!condition) throw new Error(`Static output audit failed: ${message}`);
}

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, " ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/&#39;|&apos;/gu, "'")
    .replace(/&quot;/gu, '"')
    .replace(/&amp;/gu, "&")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">")
    .replace(/&nbsp;/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

const htmlFiles = await collectHtmlFiles(outputRoot);
assert(htmlFiles.length === 20, `expected 20 HTML pages, found ${htmlFiles.length}`);

const pages = new Map(
  await Promise.all(
    htmlFiles.map(async (file) => [
      relative(projectRoot, file).split(sep).join("/"),
      await readFile(file, "utf8"),
    ]),
  ),
);

const localePrefixes = ["", "zh-tw", "zh-cn", "ja"];
const routeSuffixes = ["", "contact", "privacy", "terms", "success"];
const languageTriggerByLocalePrefix = new Map([
  ["", { shortLabel: "EN", accessibleLabel: "Choose language: English" }],
  ["zh-tw", { shortLabel: "繁中", accessibleLabel: "選擇語言: 繁體中文" }],
  ["zh-cn", { shortLabel: "简中", accessibleLabel: "选择语言: 简体中文" }],
  ["ja", { shortLabel: "日本語", accessibleLabel: "言語を選択: 日本語" }],
]);
const expectedPages = new Map();

for (const localePrefix of localePrefixes) {
  for (const routeSuffix of routeSuffixes) {
    const segments = [localePrefix, routeSuffix].filter(Boolean);
    const publicPath = `/${segments.join("/")}`;
    const outputPath = `dist${publicPath === "/" ? "/index.html" : `${publicPath}/index.html`}`;
    expectedPages.set(outputPath, { localePrefix, routeSuffix });
  }
}

assert(
  pages.size === expectedPages.size,
  `expected ${expectedPages.size} HTML pages, found ${pages.size}`,
);

for (const [path, { localePrefix, routeSuffix }] of expectedPages) {
  const html = pages.get(path);
  assert(html, `${path} was not generated`);

  const expectedTrigger = languageTriggerByLocalePrefix.get(localePrefix);
  assert(expectedTrigger, `${path} has no expected language trigger`);
  const languageTriggers = [
    ...html.matchAll(
      /<summary\b(?=[^>]*\bdata-language-trigger(?:\s|=|>))([^>]*)>([\s\S]*?)<\/summary>/giu,
    ),
  ];
  assert(
    languageTriggers.length === 1,
    `${path} must render exactly one language selector trigger`,
  );
  const [, triggerAttributes, triggerContent] = languageTriggers[0];
  const triggerAccessibleLabel =
    triggerAttributes.match(/\baria-label="([^"]+)"/iu)?.[1] ?? "";
  assert(
    triggerAccessibleLabel === expectedTrigger.accessibleLabel,
    `${path} has unexpected language trigger accessible name "${triggerAccessibleLabel}"`,
  );
  const triggerIcons = [
    ...triggerContent.matchAll(
      /<svg\b(?=[^>]*\baria-hidden="true")[^>]*>/giu,
    ),
  ];
  assert(
    triggerIcons.length === 2,
    `${path} language trigger must retain its globe and chevron icons`,
  );
  const triggerText = visibleText(
    triggerContent.replace(/<svg\b[\s\S]*?<\/svg>/giu, ""),
  );
  assert(
    triggerText === expectedTrigger.shortLabel,
    `${path} has unexpected visible language trigger text "${triggerText}"`,
  );

  const localeLinks =
    html.match(/<a\b(?=[^>]*\bdata-language-link(?:\s|=|>))[^>]*>/giu) ?? [];
  assert(localeLinks.length === 4, `${path} does not expose all four language links`);

  const localeHrefs = localeLinks.map(
    (link) => link.match(/\bhref="([^"]+)"/iu)?.[1] ?? "",
  );
  assert(localeHrefs.every(Boolean), `${path} has a language link without an href`);
  assert(
    new Set(localeHrefs).size === 4,
    `${path} does not expose four distinct language destinations`,
  );

  for (const targetLocalePrefix of localePrefixes) {
    const expectedHref = `/${[targetLocalePrefix, routeSuffix].filter(Boolean).join("/")}`;
    assert(
      localeHrefs.includes(expectedHref),
      `${path} lacks language destination ${expectedHref}`,
    );
  }

  assert(
    localeLinks.filter((link) => /\baria-current="page"/iu.test(link)).length === 1,
    `${path} must mark exactly one language as current`,
  );
  assert(!/formspree|your-form-id/iu.test(html), `${path} contains a placeholder form destination`);
}

for (const path of [
  "dist/contact/index.html",
  "dist/zh-tw/contact/index.html",
  "dist/zh-cn/contact/index.html",
  "dist/ja/contact/index.html",
]) {
  const html = pages.get(path);
  assert(html, `${path} was not generated`);
  const contactForm =
    html.match(/<form\b(?=[^>]*\bid="contact-form")[^>]*>/iu)?.[0] ?? "";
  assert(
    /\baction="mailto:hello@ultrspeak\.com"/iu.test(contactForm),
    `${path} has an invalid contact form action`,
  );
  assert(html.includes("mailto:hello@ultrspeak.com"), `${path} lacks the direct email fallback`);
  assert(html.includes("contact-draft-fallback"), `${path} lacks the copyable draft fallback`);
}

const homepagePositioning = new Map([
  [
    "dist/index.html",
    {
      metaTitle: "ultrspeak — Private, Offline Voice Dictation for Mac and Windows",
      metaDescription:
        "Private voice dictation for Mac and Windows. Turn English or Mandarin speech into clear text at your cursor, on-device and offline.",
      title: "Your words,",
      titleAccent: "ready at the cursor.",
      pricingAllowance: "Up to 8,000 words per week",
      pricingLanguage: "English & Mandarin",
      pricingAnnual: "USD / year",
      formerAllowance:
        /2,000|\b8,000\s+words?\s+(?:a|per|each|every)\s+day\b/iu,
    },
  ],
  [
    "dist/zh-tw/index.html",
    {
      metaTitle: "ultrspeak — 私密離線語音輸入，Mac 與 Windows 適用",
      metaDescription:
        "適用於 Mac 與 Windows 的裝置端語音輸入。支援英文與華語，離線也能將語音整理成清楚文字，直接輸入游標所在位置。",
      title: "用說的，",
      titleAccent: "寫得更清楚。",
      pricingAllowance: "每週可免費輸入 8,000 字詞",
      pricingLanguage: "英文與中文",
      pricingAnnual: "美元／年",
      formerAllowance:
        /2,000|(?:每天|每日)(?:可免費輸入)?\s*8,000\s*字詞|8,000\s*字詞(?:\/|／|每)(?:天|日)|每周可免費輸入\s*8,000/u,
    },
  ],
  [
    "dist/zh-cn/index.html",
    {
      metaTitle: "ultrspeak — 私密离线语音输入，Mac 与 Windows 适用",
      metaDescription:
        "适用于 Mac 与 Windows 的本地语音输入。支持英语和普通话，离线也能将语音整理成清晰文字，直接输入光标所在位置。",
      title: "直接说，",
      titleAccent: "写得更清楚。",
      pricingAllowance: "每周可免费输入 8,000 字词",
      pricingLanguage: "英文与中文",
      pricingAnnual: "美元／年",
      formerAllowance:
        /2,000|(?:每天|每日)(?:可免费输入)?\s*8,000\s*字词|8,000\s*字词(?:\/|／|每)(?:天|日)|每週可免費輸入\s*8,000/u,
    },
  ],
  [
    "dist/ja/index.html",
    {
      metaTitle: "ultrspeak — プライベートでオフラインの音声入力、Mac・Windows 対応",
      metaDescription:
        "Mac・Windows向けのオンデバイス音声入力。英語と中国語（普通話）の音声をカーソル位置で整った文章に。オフラインでも使えます。",
      title: "話すだけで、",
      titleAccent: "伝わる文章に。",
      pricingAllowance: "週8,000語まで無料",
      pricingLanguage: "英語・中国語",
      pricingAnnual: "USD／年",
      formerAllowance:
        /2,000|(?:1日|日あたり|毎日)\s*8,000語|8,000語(?:\/|／)?(?:1日|日あたり|毎日)/u,
    },
  ],
]);

const retiredHomepageCopy = [
  "Speak. It&#39;s already written.",
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

const retiredUniversalCopy = [
  "any text field",
  "every app",
  "from any app",
  "Works everywhere",
  "Hold a key, anywhere",
  "If you can type in it",
  "任何文字欄位",
  "每個應用程式",
  "無論在哪個應用程式",
  "隨處按住按鍵就能說",
  "能打字的地方",
  "任何文本框",
  "每个应用程序",
  "无论在哪个应用程序",
  "随处按住按键就能说",
  "あらゆるテキスト欄",
  "どのアプリでも",
  "どのアプリからでも",
  "どこでもキーを押して話すだけ",
  "文字を打てる場所なら",
];

for (const [path, expected] of homepagePositioning) {
  const html = pages.get(path);
  assert(html, `${path} was not generated`);

  const titleText =
    html.match(/<title>([\s\S]*?)<\/title>/iu)?.[1]?.trim() ?? "";
  const descriptionTag =
    html.match(/<meta\b(?=[^>]*\bname="description")[^>]*>/iu)?.[0] ?? "";
  const ogTitleTag =
    html.match(/<meta\b(?=[^>]*\bproperty="og:title")[^>]*>/iu)?.[0] ?? "";
  const ogDescriptionTag =
    html.match(/<meta\b(?=[^>]*\bproperty="og:description")[^>]*>/iu)?.[0] ?? "";
  assert(titleText === expected.metaTitle, `${path} has unexpected page title`);
  assert(
    descriptionTag.includes(`content="${expected.metaDescription}"`),
    `${path} has unexpected meta description`,
  );
  assert(
    ogTitleTag.includes(`content="${expected.metaTitle}"`),
    `${path} has unexpected Open Graph title`,
  );
  assert(
    ogDescriptionTag.includes(`content="${expected.metaDescription}"`),
    `${path} has unexpected Open Graph description`,
  );

  const heroHtml =
    html.match(
      /<section\b(?=[^>]*\bdata-home-hero(?:\s|=|>))[^>]*>([\s\S]*?)<\/section>/iu,
    )?.[1] ?? "";
  const heroText = visibleText(heroHtml);
  const normalizedHeroText = heroText
    .normalize("NFKC")
    .replace(/[\s,，]/gu, "");
  assert(heroText, `${path} lacks the rendered home hero`);
  assert(heroText.includes("Mac"), `${path} lacks the Mac platform disclosure`);
  assert(heroText.includes("Windows"), `${path} lacks the Windows platform disclosure`);
  assert(heroText.includes(expected.title), `${path} lacks visible hero title "${expected.title}"`);
  assert(
    heroText.includes(expected.titleAccent),
    `${path} lacks visible hero accent "${expected.titleAccent}"`,
  );
  assert(
    !/\bdata-home-hero-qualification(?:\s|=|>)/iu.test(heroHtml),
    `${path} renders a hero qualification marker`,
  );
  assert(
    !/<kbd\b/iu.test(heroHtml),
    `${path} renders a keyboard key in the hero`,
  );
  assert(
    !/8000|eightthousand|八千/iu.test(normalizedHeroText),
    `${path} renders the Free allowance in the hero`,
  );
  assert(
    !/(?:USD|US\$|\$)19\.49|19\.49(?:USD|美元)/iu.test(normalizedHeroText),
    `${path} renders the Pro price in the hero`,
  );
  assert(
    !/⌥\s*Space|Alt\s*\+\s*Space/iu.test(heroText),
    `${path} renders the removed shortcut in the hero`,
  );

  const heroBodyMarkers = [
    ...heroHtml.matchAll(
      /<p\b(?=[^>]*\bdata-home-hero-body(?:\s|=|>))[^>]*>/giu,
    ),
  ];
  const actionMarkers = [
    ...heroHtml.matchAll(
      /<div\b(?=[^>]*\bdata-home-hero-actions(?:\s|=|>))[^>]*>/giu,
    ),
  ];
  assert(
    heroBodyMarkers.length === 1,
    `${path} must render exactly one hero body marker`,
  );
  assert(
    actionMarkers.length === 1,
    `${path} must render exactly one hero action marker`,
  );
  assert(
    /<\/p>\s*<div\b(?=[^>]*\bdata-home-hero-actions(?:\s|=|>))/iu.test(
      heroHtml,
    ),
    `${path} hero actions must immediately follow the hero body`,
  );
  const actionsHtml =
    heroHtml.match(
      /<div\b(?=[^>]*\bdata-home-hero-actions(?:\s|=|>))[^>]*>([\s\S]*?)<\/div>/iu,
    )?.[1] ?? "";
  const actionLinks = [...actionsHtml.matchAll(/<a\b[^>]*>/giu)].map(
    (match) => match[0],
  );
  assert(
    actionLinks.length === 2,
    `${path} must render exactly two hero action links`,
  );
  assert(
    actionLinks[0]?.includes('href="#download"') &&
      actionLinks[1]?.includes('href="#modes"'),
    `${path} hero actions have unexpected order or destinations`,
  );
  for (const actionLink of actionLinks) {
    assert(
      /\bmin-h-14\b/u.test(actionLink) &&
        /\bsm:min-h-16\b/u.test(actionLink) &&
        /\bw-full\b/u.test(actionLink) &&
        /\bfocus-visible:outline-2\b/u.test(actionLink),
      `${path} hero actions lost equal accessible sizing or focus treatment`,
    );
  }
  assert(
    /\bgrid-cols-1\b/u.test(actionMarkers[0][0]) &&
      actionMarkers[0][0].includes("sm:grid-cols-[12rem_12rem]"),
    `${path} hero actions lost stacked mobile or equal desktop geometry`,
  );

  const pricingHtml =
    html.match(
      /<section\b(?=[^>]*\bid="pricing")[^>]*>([\s\S]*?)<\/section>/iu,
    )?.[1] ?? "";
  const freePricingHtml =
    pricingHtml.match(
      /<article\b(?=[^>]*\bdata-pricing-plan="free")[^>]*>([\s\S]*?)<\/article>/iu,
    )?.[1] ?? "";
  const freePricingText = visibleText(freePricingHtml);
  assert(freePricingText, `${path} lacks the rendered Free pricing card`);
  assert(
    freePricingText.includes(expected.pricingAllowance),
    `${path} lacks Free pricing allowance "${expected.pricingAllowance}"`,
  );
  assert(
    freePricingText.includes(expected.pricingLanguage),
    `${path} lacks supported languages in Free pricing`,
  );
  const proPricingHtml =
    pricingHtml.match(
      /<article\b(?=[^>]*\bdata-pricing-plan="pro")[^>]*>([\s\S]*?)<\/article>/iu,
    )?.[1] ?? "";
  const proPricingText = visibleText(proPricingHtml);
  assert(
    proPricingText.includes("$19.49") &&
      proPricingText.includes(expected.pricingAnnual),
    `${path} lacks the annual Pro price in pricing`,
  );
  const pageText = visibleText(html);
  assert(
    !expected.formerAllowance.test(pageText),
    `${path} contains the former daily free-tier allowance`,
  );
  assert(
    !pageText.includes("2,000"),
    `${path} contains the former 2,000-word free-tier allowance`,
  );
  for (const retired of retiredHomepageCopy) {
    assert(!pageText.includes(retired), `${path} contains retired copy "${retired}"`);
  }
  for (const retired of retiredUniversalCopy) {
    assert(
      !pageText.toLocaleLowerCase().includes(retired.toLocaleLowerCase()),
      `${path} contains an unqualified universal claim "${retired}"`,
    );
  }
  assert(
    !/perfect(?:ly)?\s+(?:formatted\s+)?text|(?:3|three)\s*(?:x|×|times?)\s*(?:as\s+)?fast(?:er)?|3\s*倍|三倍/iu.test(
      pageText,
    ),
    `${path} contains an unsupported homepage claim`,
  );
}

const privacyHeadlines = new Map([
  ["dist/index.html", "It never leaves your computer"],
  ["dist/zh-tw/index.html", "聲音不會離開你的電腦"],
  ["dist/zh-cn/index.html", "声音不会离开你的电脑"],
  ["dist/ja/index.html", "声はコンピューターの外へ出ません"],
]);

for (const [path, expected] of privacyHeadlines) {
  const html = pages.get(path);
  assert(html, `${path} was not generated`);
  assert(
    html.includes(expected),
    `${path} lacks privacy headline "${expected}"`,
  );
}

const currentYear = new Date().getFullYear();
const copyrightByLocale = new Map([
  ["en", `© ${currentYear} ultrspeak. All rights reserved.`],
  ["zh-tw", `© ${currentYear} ultrspeak。保留一切權利。`],
  ["zh-cn", `© ${currentYear} ultrspeak。保留所有权利。`],
  ["ja", `© ${currentYear} ultrspeak. すべての権利を保有します。`],
]);

for (const [path, html] of pages) {
  const locale = /^dist\/(zh-tw|zh-cn|ja)\//u.exec(path)?.[1] ?? "en";
  const expected = copyrightByLocale.get(locale);
  assert(expected, `${path} has no expected copyright locale`);

  const copyrightTag =
    html.match(
      /<span\b(?=[^>]*\bdata-footer-copyright(?:\s|=|>))[^>]*>([\s\S]*?)<\/span>/iu,
    )?.[1] ?? "";
  const actual = copyrightTag.replace(/<[^>]+>/gu, "").replace(/\s+/gu, " ").trim();
  assert(
    actual === expected,
    `${path} has copyright "${actual}", expected "${expected}"`,
  );
}

console.log(`Static output audit passed (${htmlFiles.length} pages).`);
