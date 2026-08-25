// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import {
  defaultLocale,
  localeConfig,
  locales,
} from './src/i18n/config.ts';

const localePaths = locales.map(
  (locale) => localeConfig[locale].path || locale,
);

// https://astro.build/config
export default defineConfig({
  site: 'https://ultrspeak.com',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: localeConfig[defaultLocale].path || defaultLocale,
    locales: localePaths,
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
