import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { products } from "./src/data/products";

/** Public routes worth indexing, with how often each realistically changes.
    Transactional routes (/cart, /checkout, /account, /login) are deliberately
    absent — they carry `noindex` and must stay crawlable for that to be read. */
const STATIC_ROUTES: Array<[path: string, changefreq: string]> = [
  ["/", "weekly"],
  ["/process", "monthly"],
  ["/numbers", "monthly"],
  ["/reviews", "weekly"],
  ["/faqs", "monthly"],
  ["/doctors", "monthly"],
  ["/quiz", "monthly"],
  ["/affiliates", "monthly"],
  ["/refund-policy", "yearly"],
  ["/contact", "yearly"],
];

/** Emits robots.txt and sitemap.xml at build time.

    The sitemap's product URLs are derived from `products.ts` rather than
    hand-maintained, because the checked-in copy had drifted: it advertised
    /product/semaglutide and /product/cagrilintide (neither exists — both
    soft-redirect to home) while omitting four real products. */
function seoFiles(siteUrl: string, buildDate: string): Plugin {
  const origin = siteUrl.replace(/\/$/, "");

  const urls = [
    ...STATIC_ROUTES.map(([path, changefreq]) => ({ path, changefreq })),
    ...products.map((p) => ({
      path: `/product/${p.slug}`,
      changefreq: "weekly",
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, changefreq }) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  // No Disallow for /cart, /checkout, /account, /login: those pages set a
  // `noindex` meta, and a crawler that is disallowed never fetches the page
  // and so never sees it — leaving them eligible for URL-only indexing.
  // Crawlable + noindex is what actually keeps them out of the index.
  const robots = `# Vyra Health
User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

  return {
    name: "vyra-seo-files",
    apply: "build",
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap });
      this.emitFile({ type: "asset", fileName: "robots.txt", source: robots });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // Single source of truth for the origin. index.html reads the same value via
  // Vite's %VITE_SITE_URL% substitution, and src/lib/seo.ts via import.meta.env.
  const siteUrl = env.VITE_SITE_URL || "https://www.vyrahealth.example";
  const buildDate = new Date().toISOString().slice(0, 10);

  return {
    plugins: [react(), seoFiles(siteUrl, buildDate)],
    build: {
      // Split large, rarely-changing vendor code into its own long-cacheable
      // chunks so an app-code change doesn't bust the whole bundle.
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("react-router")) return "router";
            if (id.includes("framer-motion") || id.includes("motion-dom"))
              return "motion";
            if (id.includes("react")) return "react-vendor";
            return undefined;
          },
        },
      },
      // The split vendor chunks stay under this; keeps the build output clean.
      chunkSizeWarningLimit: 700,
    },
  };
});
