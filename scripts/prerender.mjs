// Post-build step: writes a static HTML file for every public page so that
// crawlers that don't run JavaScript see real content, titles and descriptions.
// The React app replaces this content as soon as it loads, so visitors see no change.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pages, SITE } from "./seo-pages.mjs";

const dist = "dist";
const template = readFileSync(join(dist, "index.html"), "utf8");
const esc = (s) => s.replace(/&(?!amp;)/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const swap = (html, marker, content) => {
  const re = new RegExp(`<!--${marker}-->[\\s\\S]*?<!--/${marker}-->`);
  if (!re.test(html)) throw new Error(`Marker ${marker} missing from dist/index.html`);
  return html.replace(re, `<!--${marker}-->${content}<!--/${marker}-->`);
};

for (const page of pages) {
  // Netlify serves /services from /services/index.html and redirects to the trailing-slash URL,
  // so that is the canonical address.
  const url = SITE + (page.path === "/" ? "/" : `${page.path}/`);
  const head = `
    <title data-static-seo>${esc(page.title)}</title>
    <meta data-static-seo name="description" content="${esc(page.description)}" />
    <link data-static-seo rel="canonical" href="${url}" />
    <meta data-static-seo property="og:title" content="${esc(page.title)}" />
    <meta data-static-seo property="og:description" content="${esc(page.description)}" />
    <meta data-static-seo property="og:url" content="${url}" />
    `;
  let html = swap(template, "seo:head", head);
  html = swap(html, "seo:body", page.body);
  const outDir = page.path === "/" ? dist : join(dist, page.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log(`prerendered ${page.path}`);
}
