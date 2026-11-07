import { defineConfig } from "astro/config";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "homepage";
const isUserSite = repoName.endsWith(".github.io");
const base = process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS === "true" && !isUserSite ? `/${repoName}/` : "/");
const site = process.env.SITE_URL ?? "https://trixt0r.github.io/";

export default defineConfig({
  site,
  base,
  output: "static",
  build: { inlineStylesheets: "always" }
  // German is served from the site root. The former /de/ URL is a hand-written stub (src/pages/de/index.astro):
  // GitHub Pages cannot send HTTP 301s, so it is a meta refresh plus a canonical link pointing at the root.
});
