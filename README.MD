# Portfolio

Static multilingual portfolio (Astro) for Heinrich Reich, deployed to GitHub Pages.

- `npm start` – dev server, `npm run build` – production build into `dist/`.
- `npm test` – builds and runs `scripts/seo.test.mjs`, which checks the generated HTML (canonicals, hreflang
  reciprocity, sitemap, JSON-LD, internal links, redirect stub for `/de/`, 404 page, no language auto-redirect).
SEO decisions, open evidence gaps and the Search Console checklist are in `docs/seo.md`.

## Content

Text lives in `content/<lang>/*.json` (`de`, `en`, `ru`, `fr`, `it`); every file is picked up automatically by
`src/lib/content.ts`. German is served from the site root (`/`), the others from `/en/`, `/ru/`, `/fr/`, `/it/`.
`/de/` is an HTML redirect stub to `/` (GitHub Pages cannot send an HTTP 301). Interface strings are in `ui.json`.
Adding a language: add it to `locales` in `src/lib/i18n.ts` (plus `localeNames`, `ogLocales`) and create the content files.
French and Italian are translations only; the languages list still shows just German, Russian and English. `ui.translationNote` is an optional, currently empty, note.

The language is always determined by the URL. There is no automatic redirect; a dismissible, script-rendered hint
(`LanguageSuggestion.astro`) offers the visitor's saved or browser language as a normal link. `x-default` points to English.
Unknown URLs get `dist/404.html` (HTTP 404 on GitHub Pages, `noindex`, not in the sitemap).

Project detail pages are defined in `content/<lang>/project-pages.json`. The `id` matches an entry in `projects.json`
and becomes the URL (`/projects/<id>/`, `/en/projects/<id>/`). A page only exists in a language if it has an entry in
that language's file; hreflang, the language switcher, the sitemap and `llms.txt` follow automatically
(see `src/lib/seo.ts`). Russian has no project pages yet, so its project cards link to GitHub and to the English pages.
Bump `updatedAt` when a page's content meaningfully changes; it feeds `lastmod` and `dateModified`.
