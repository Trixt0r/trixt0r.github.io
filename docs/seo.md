# SEO notes

## How the site is wired
- Static Astro build on GitHub Pages. Canonical, hreflang (head) and the sitemap all derive from `getSiteRoutes()` in
  `src/lib/seo.ts`, so they cannot drift apart. `npm test` verifies this against the built HTML.
- Indexable pages: homepage in `de` (`/`), `en`, `ru`, `fr`, `it`; project pages for ECSTS, Y.A.M.E. and the Spriter runtime in `de` and `en`.
- Not indexable by design: `/de/` (redirect stub), `/404.html` (`noindex`).
- Redirect limitation: GitHub Pages cannot send HTTP redirects. `/de/` is an instant meta refresh with a canonical link to `/`.
  Google treats an instant meta refresh as a permanent redirect, but it is not an HTTP 301. A real 301 would require
  another host or a CDN in front (not done on purpose).
- Structured data: one `WebSite` (`#website`) and one `Person` (`#person`) identity on every page; `ProfilePage` on homepages,
  `WebPage` + `SoftwareSourceCode` on project pages. `dateModified` and sitemap `lastmod` come from `updatedAt` fields
  in content (`seo.json`, `project-pages.json`): bump them only for substantive content changes, never per build.

## Positioning decisions
- Homepage title pattern: `Heinrich Reich – <Role> in <Switzerland>`; h1 is the name, h2 role + city + country.
- "AI Engineer" is deliberately absent from titles and structured data. The repository documents AI-assisted development
  (Claude Code, Codex, Gemini, OpenCode, agentic workflows), not building AI systems; the skills group is therefore named
  "AI-assisted development". Role-specific landing pages (architect / senior engineer / AI) were not created: without
  case-study material they would only restate the homepage.

## Evidence needed before the next positioning step
1. **SmartCapacity case study** (zeit ag). Verified publicly: zeit ag's LinkedIn post names Heinrich Reich and Simon Bled as
   the two developers, and the product page describes SmartCapacity as AI-assisted workforce/shift planning. Missing, needed from the
   owner and cleared with zeit ag for public disclosure: personal responsibilities, constraints, architecture decisions and
   trade-offs, testing/deployment/operations practices, and which outcomes may be named. The post's figures (lines of code, tests,
   hours, provisioning time) are zeit ag's own team claims and are intentionally not republished.
2. **AI Engineer**: concrete experience shipping AI features (model integration, tool calling/agents, retrieval, evaluation,
   failure handling, privacy, latency/cost, monitoring), and which parts were personally built, e.g. in SmartCapacity's AI assistant or planning.
3. **Services**: whether freelance/consulting work is offered, and in which markets. Nothing is claimed today.
4. **Languages**: LinkedIn lists English as "professional working proficiency" and French/Dutch as elementary; the site says English "fluent". Align them.
5. **Optional**: public references (talks, articles) and README back-links from the three GitHub repositories to the project pages.

## Search Console owner checklist
1. Add a URL-prefix property for `https://trixt0r.github.io/` (HTML-file verification already exists in `public/`; do not publish any new tokens).
2. Submit `https://trixt0r.github.io/sitemap.xml`.
3. URL Inspection on `/`, `/en/`, `/ru/`, `/fr/`, `/it/` and the three project pages: compare user-declared and Google-selected canonical.
4. After deployment, "Request indexing" for the homepages and project pages once; do not repeat without content changes.
5. Monitor Performance: queries, pages, clicks, impressions, CTR, average position.
6. Separate branded searches (query contains "heinrich reich") from role searches (regex filter) and compare.
7. Filter by country Switzerland and compare language pages (page filter `/en/`, `/fr/`, ...).
8. Compare equal periods (e.g. 28 days) before and after recrawl; allow weeks for changes to show.
