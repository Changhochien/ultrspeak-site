export const locales = ["en", "zh-TW", "zh-CN", "ja"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeConfig = {
  en: {
    path: "",
    label: "English",
    htmlLang: "en",
  },
  "zh-TW": {
    path: "zh-tw",
    label: "繁體中文",
    htmlLang: "zh-TW",
  },
  "zh-CN": {
    path: "zh-cn",
    label: "简体中文",
    htmlLang: "zh-CN",
  },
  ja: {
    path: "ja",
    label: "日本語",
    htmlLang: "ja",
  },
} as const satisfies Record<
  Locale,
  { path: string; label: string; htmlLang: string }
>;

export const publicRoutes = [
  "home",
  "contact",
  "success",
  "privacy",
  "terms",
] as const;

export type PublicRoute = (typeof publicRoutes)[number];

export const routeSegments = {
  home: "",
  contact: "contact",
  success: "success",
  privacy: "privacy",
  terms: "terms",
} as const satisfies Record<PublicRoute, string>;
