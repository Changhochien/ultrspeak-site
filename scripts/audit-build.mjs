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
const expectedPages = new Map();

for (const localePrefix of localePrefixes) {
  for (const routeSuffix of routeSuffixes) {
    const segments = [localePrefix, routeSuffix].filter(Boolean);
    const publicPath = `/${segments.join("/")}`;
    const outputPath = `dist${publicPath === "/" ? "/index.html" : `${publicPath}/index.html`}`;
    expectedPages.set(outputPath, { routeSuffix });
  }
}

assert(
  pages.size === expectedPages.size,
  `expected ${expectedPages.size} HTML pages, found ${pages.size}`,
);

for (const [path, { routeSuffix }] of expectedPages) {
  const html = pages.get(path);
  assert(html, `${path} was not generated`);

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

  for (const localePrefix of localePrefixes) {
    const expectedHref = `/${[localePrefix, routeSuffix].filter(Boolean).join("/")}`;
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

const homeCopy = new Map([
  ["dist/index.html", "It never leaves your computer"],
  ["dist/zh-tw/index.html", "聲音不會離開你的電腦"],
  ["dist/zh-cn/index.html", "声音不会离开你的电脑"],
  ["dist/ja/index.html", "声はコンピューターの外へ出ません"],
]);

for (const [path, expected] of homeCopy) {
  const html = pages.get(path);
  assert(html, `${path} was not generated`);
  assert(html.includes(expected), `${path} lacks the cross-platform privacy headline`);
}

console.log(`Static output audit passed (${htmlFiles.length} pages).`);
