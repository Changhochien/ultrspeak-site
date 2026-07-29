import {
  defaultLocale,
  localeConfig,
  locales,
  publicRoutes,
  routeSegments,
  type Locale,
  type PublicRoute,
} from "./config";

const localePathMap = new Map<string, Locale>(
  locales
    .filter((locale) => locale !== defaultLocale)
    .map((locale) => [localeConfig[locale].path, locale]),
);

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getRouteFromPathname(pathname: string): PublicRoute {
  const pathOnly = pathname.split(/[?#]/, 1)[0] ?? "/";
  const segments = pathOnly.split("/").filter(Boolean);

  if (segments[0] && localePathMap.has(segments[0].toLowerCase())) {
    segments.shift();
  }

  if (segments.length > 1) return "home";

  const route = publicRoutes.find(
    (candidate) => routeSegments[candidate] === (segments[0] ?? ""),
  );

  return route ?? "home";
}

export function getLocalizedPath(
  locale: Locale,
  route: PublicRoute,
): string {
  const prefix = localeConfig[locale].path;
  const segment = routeSegments[route];
  const parts = [prefix, segment].filter(Boolean);

  return parts.length === 0 ? "/" : `/${parts.join("/")}`;
}

export function getLocaleSwitchPath(
  locale: Locale,
  pathname: string,
  search = "",
  hash = "",
): string {
  return `${getLocalizedPath(locale, getRouteFromPathname(pathname))}${search}${hash}`;
}

export function getAbsoluteLocalizedUrl(
  site: URL | string,
  locale: Locale,
  route: PublicRoute,
): URL {
  return new URL(getLocalizedPath(locale, route), site);
}

export function getAlternateLinks(site: URL | string, route: PublicRoute) {
  const links = locales.map((locale) => ({
    locale,
    hreflang: localeConfig[locale].htmlLang,
    href: getAbsoluteLocalizedUrl(site, locale, route).toString(),
  }));

  return [
    ...links,
    {
      locale: defaultLocale,
      hreflang: "x-default",
      href: getAbsoluteLocalizedUrl(site, defaultLocale, route).toString(),
    },
  ] as const;
}
