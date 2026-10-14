import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

/* ui.krizaka.com is a static site: every page is generated at build time from the workspace packages (the registries,
   the tokens, the fonts, the icons) and served as files by DigitalOcean App Platform (static site component, see
   deploy/app.yaml). No server: no redirects, rewrites or headers here — the old krizaka.com/docs/ui addresses answer
   308 from krizaka.com itself; the maps read their tiles from the Krizaka CDN directly (the default of @krizaka/ui/map). */
const nextConfig: NextConfig = {
  output: "export",
  // /components/button is written as components/button/index.html: every static host serves it at the clean URL.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // Screenshots are PNG files of the registry, copied to public/ui-examples: served as they are (no image server).
  images: { unoptimized: true },
  // The examples of the registries are shipped as source (.tsx) next to their compiled modules.
  transpilePackages: ["@krizaka/ui", "@krizaka/charts"],
  // One 404 page for the two root layouts (English at /, French under /fr).
  experimental: { globalNotFound: true },
};

/* Fumadocs: compiles the collection of source.config.ts into .source/ (content/docs). */
const withMDX = createMDX();

export default withMDX(nextConfig);
