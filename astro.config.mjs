import { defineConfig } from "astro/config";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "homepage";
const isUserSite = repoName.endsWith(".github.io");
const base = process.env.BASE_PATH ?? (process.env.GITHUB_ACTIONS === "true" && !isUserSite ? `/${repoName}/` : "/");
const site = process.env.SITE_URL ?? "https://trixt0r.github.io/";

export default defineConfig({
  site,
  base,
  output: "static",
  build: { inlineStylesheets: "always" },
  // German is served from the site root. GitHub Pages cannot send HTTP redirects, so this emits a
  // static stub for the former /de/ URL (meta refresh plus canonical link pointing at the root).
  redirects: { "/de": "/" }
});
