// Post-build SEO checks. Run with `npm test` (builds first) or `node --test scripts/` after `npm run build`.
// They inspect the generated HTML in dist/, which is what GitHub Pages serves.
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const site = new URL(process.env.SITE_URL ?? "https://trixt0r.github.io/");
const base = process.env.BASE_PATH ?? "/";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const urlFor = (file) => {
  const rel = relative(dist, file).replace(/\\/g, "/").replace(/index\.html$/, "");
  return new URL(base.replace(/^\/|\/$/g, "") ? `${base}${rel}` : `/${rel}`, site).toString();
};
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const decode = (value) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const files = walk(dist).filter((file) => file.endsWith(".html") && !file.endsWith("google375fce895bf9f57e.html"));
const pages = files.map((file) => {
  const html = readFileSync(file, "utf8");
  return {
    file,
    html,
    url: urlFor(file),
    redirect: /http-equiv="refresh"/.test(html),
    lang: html.match(/<html[^>]*lang="([^"]+)"/)?.[1],
    title: html.match(/<title>([^<]*)<\/title>/)?.[1],
    description: html.match(/<meta name="description" content="([^"]*)"/)?.[1],
    robots: html.match(/<meta name="robots" content="([^"]*)"/)?.[1],
    canonical: html.match(/<link rel="canonical" href="([^"]*)"/)?.[1],
    alternates: Object.fromEntries(
      [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]])
    )
  };
});
const indexable = pages.filter((page) => !page.redirect);
const byUrl = new Map(pages.map((page) => [page.url, page]));

test("expected pages are built", () => {
  assert.ok(indexable.length >= 3, "home pages for each language");
  for (const lang of ["", "en/", "ru/"]) assert.ok(byUrl.has(new URL(`${base}${lang}`.replace("//", "/"), site).toString()), `missing ${lang || "root"}`);
});

test("every indexable page has unique localized metadata and a self-referencing canonical", () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const page of indexable) {
    assert.ok(page.title, `${page.url}: title`);
    assert.ok(page.description, `${page.url}: description`);
    assert.equal(page.canonical, page.url, `${page.url}: canonical must reference itself`);
    assert.doesNotMatch(page.robots ?? "", /noindex/, `${page.url}: must not be noindex`);
    assert.ok(!titles.has(page.title), `duplicate title: ${page.title}`);
    assert.ok(!descriptions.has(page.description), `duplicate description: ${page.description}`);
    titles.add(page.title);
    descriptions.add(page.description);
    const og = (property) => page.html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`))?.[1];
    assert.equal(og("og:title"), page.title, `${page.url}: og:title`);
    assert.equal(og("og:description"), page.description, `${page.url}: og:description`);
    assert.equal(og("og:url"), page.url, `${page.url}: og:url`);
  }
});

test("html lang matches the language of the URL", () => {
  for (const page of indexable) {
    const expected = new URL(page.url).pathname.replace(base, "/").match(/^\/(en|ru)\//)?.[1] ?? "de";
    assert.equal(page.lang, expected, page.url);
  }
});

test("hreflang annotations are absolute, include self, are reciprocal and point at real pages", () => {
  for (const page of indexable) {
    const entries = Object.entries(page.alternates);
    assert.ok(entries.length >= 2, `${page.url}: alternates`);
    assert.equal(page.alternates[page.lang], page.url, `${page.url}: missing self reference`);
    assert.ok(page.alternates["x-default"], `${page.url}: x-default`);
    for (const [lang, href] of entries) {
      assert.match(href, /^https:\/\//, `${page.url}: ${lang} must be absolute https`);
      const target = byUrl.get(href);
      assert.ok(target && !target.redirect, `${page.url}: ${lang} alternate ${href} is not a real page`);
      if (lang !== "x-default") {
        assert.equal(target.lang, lang, `${href} is declared as ${lang}`);
        assert.deepEqual(target.alternates, page.alternates, `${href}: alternates must match ${page.url} (reciprocity)`);
      }
    }
  }
});

test("the sitemap lists exactly the indexable canonical pages", () => {
  const xml = readFileSync(join(dist, "sitemap.xml"), "utf8");
  const entries = [...xml.matchAll(/<url><loc>([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod>/g)];
  const locs = entries.map((m) => m[1]);
  assert.equal(new Set(locs).size, locs.length, "duplicate sitemap URLs");
  assert.deepEqual([...locs].sort(), indexable.map((page) => page.canonical).sort());
  for (const [, , lastmod] of entries) assert.match(lastmod, /^\d{4}-\d{2}-\d{2}$/);
  for (const [, loc] of entries) assert.ok(byUrl.has(loc), loc);
});

test("robots.txt allows crawling and references the sitemap", () => {
  const robots = readFileSync(join(dist, "robots.txt"), "utf8");
  assert.doesNotMatch(robots, /Disallow:\s*\//);
  assert.ok(robots.includes(`Sitemap: ${new URL(`${base}sitemap.xml`, site)}`));
});

test("former /de/ URL is a redirect stub that consolidates on the root", () => {
  const stub = pages.find((page) => page.url === new URL(`${base}de/`, site).toString());
  assert.ok(stub?.redirect, "/de/ should be a redirect stub");
  assert.equal(stub.canonical, new URL(base, site).toString());
  assert.ok(!Object.values(indexable[0].alternates).includes(stub.url));
});

test("structured data parses, keeps one stable person id and matches the canonical URL", () => {
  const personIds = new Set();
  for (const page of indexable) {
    const blocks = [...page.html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(decode(m[1])));
    assert.ok(blocks.length >= 1, `${page.url}: JSON-LD`);
    const nodes = blocks.flatMap((block) => block["@graph"] ?? [block]);
    const profile = nodes.find((node) => node["@type"] === "ProfilePage");
    const webpage = nodes.find((node) => node["@type"] === "WebPage");
    const main = profile ?? webpage;
    assert.equal(main.url, page.url);
    assert.equal(main.inLanguage, page.lang);
    if (profile) {
      assert.equal(profile.mainEntity["@type"], "Person");
      personIds.add(profile.mainEntity["@id"]);
      assert.ok(profile.mainEntity.sameAs.length >= 2);
    } else {
      const source = nodes.find((node) => node["@type"] === "SoftwareSourceCode");
      personIds.add(source.author["@id"]);
      assert.match(source.codeRepository, /^https:\/\/github\.com\//);
      assert.ok(nodes.some((node) => node["@type"] === "BreadcrumbList"));
    }
  }
  assert.equal(personIds.size, 1, `person @id must be stable across pages: ${[...personIds]}`);
});

test("internal links and fragments resolve, and no placeholders are published", () => {
  for (const page of indexable) {
    const ids = new Set([...page.html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of page.html.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
      const href = decode(m[1]);
      if (/^(mailto:|tel:)/.test(href)) continue;
      const target = new URL(href, page.url);
      if (target.origin !== site.origin) continue;
      const dest = target.hash && target.pathname === new URL(page.url).pathname ? page : byUrl.get(`${target.origin}${target.pathname}`);
      assert.ok(dest || existsSync(join(dist, target.pathname.replace(base, ""))), `${page.url}: broken link ${href}`);
      if (target.hash && dest && !dest.redirect) {
        const destIds = dest === page ? ids : new Set([...dest.html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]));
        assert.ok(destIds.has(target.hash.slice(1)), `${page.url}: missing fragment ${href}`);
      }
    }
    for (const m of page.html.matchAll(/<(?:img|link)\b[^>]*\s(?:src|href)="(\/[^"]*)"/g)) {
      assert.ok(existsSync(join(dist, m[1].split("#")[0])), `${page.url}: missing asset ${m[1]}`);
    }
    const text = page.html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "");
    assert.doesNotMatch(text, /\bTODO\b|\bTBD\b|lorem ipsum|\[\[|\]\]/i, `${page.url}: placeholder text`);
  }
});

test("external links open in a new tab with rel=noopener (no global <base target>)", () => {
  for (const page of indexable) {
    assert.doesNotMatch(page.html, /<base\b/, `${page.url}: <base> must not be used`);
    for (const m of page.html.matchAll(/<a\b[^>]*>/g)) {
      const href = attr(m[0], "href") ?? "";
      if (/^https?:\/\//.test(href) && new URL(href).origin !== site.origin) {
        assert.equal(attr(m[0], "target"), "_blank", `${page.url}: ${href}`);
        assert.match(attr(m[0], "rel") ?? "", /noopener/, `${page.url}: ${href}`);
      }
    }
  }
});

test("main content is present in the initial HTML", () => {
  for (const page of indexable) {
    assert.match(page.html, /<h1[^>]*>[^<]*\w/, `${page.url}: h1`);
    assert.equal([...page.html.matchAll(/<h1[\s>]/g)].length, 1, `${page.url}: exactly one h1`);
    assert.ok(page.html.length > 15000, `${page.url}: suspiciously small`);
  }
});
