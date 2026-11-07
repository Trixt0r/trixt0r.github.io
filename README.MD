# Portfolio

Static multilingual portfolio (Astro) for Heinrich Reich, deployed to GitHub Pages.

- `npm start` – dev server, `npm run build` – production build into `dist/`.
- `npm test` – builds and runs `scripts/seo.test.mjs`, which checks the generated HTML (canonicals, hreflang
  reciprocity, sitemap, JSON-LD, internal links, redirect stub for `/de/`).

## Content

Text lives in `content/<lang>/*.json` (`de`, `en`, `ru`). German is served from the site root (`/`), English and Russian
from `/en/` and `/ru/`; `/de/` only redirects to `/`.

Project detail pages are defined in `content/<lang>/project-pages.json`. The `id` matches an entry in `projects.json`
and becomes the URL (`/projects/<id>/`, `/en/projects/<id>/`). A page only exists in a language if it has an entry in
that language's file; hreflang, the language switcher, the sitemap and `llms.txt` follow automatically
(see `src/lib/seo.ts`). Russian has no project pages yet, so its project cards link to GitHub and to the English pages.
Bump `updatedAt` when a page's content meaningfully changes; it feeds `lastmod` and `dateModified`.
