import { useEffect } from "react";

/* ============================================================
   Lightweight, dependency-free SEO head manager for this SPA.
   `useSeo` upserts the per-route <title>, description, canonical,
   Open Graph and Twitter tags; `useJsonLd` injects structured data
   and cleans it up on unmount so page-specific schema never leaks.
   ============================================================ */

// Set VITE_SITE_URL in .env to the production origin. The same value feeds
// index.html (via Vite's %VITE_SITE_URL% substitution) and the generated
// sitemap.xml/robots.txt, so the origin is declared in exactly one place.
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://www.vyrahealth.example"
).replace(/\/$/, "");
export const SITE_NAME = "Vyra Health";
const DEFAULT_IMAGE = `${SITE_URL}/images/hero2.webp`;

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Write `content`, or remove the tag entirely when there is nothing to write.
    Removal matters: these tags live on a single shared <head> across an SPA's
    lifetime, so a tag left behind by the previous route would be inherited by
    the next one rather than simply being absent. */
function setMeta(
  attr: "name" | "property",
  key: string,
  content: string | undefined
) {
  if (content) {
    upsertMeta(attr, key, content);
    return;
  }
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export interface SeoOptions {
  /** page-specific title; suffixed with the site name unless titleTemplate=false */
  title: string;
  description?: string;
  /** route path for canonical + og:url; defaults to the current pathname */
  path?: string;
  image?: string;
  /** og:type — e.g. "website" or "product" */
  type?: string;
  /** exclude the page from indexing (login, account, checkout, cart…) */
  noindex?: boolean;
  titleTemplate?: boolean;
}

export function useSeo(opts: SeoOptions) {
  const {
    title,
    description,
    path,
    image,
    type = "website",
    noindex = false,
    titleTemplate = true,
  } = opts;

  useEffect(() => {
    const fullTitle = titleTemplate ? `${title} — ${SITE_NAME}` : title;
    const url = `${SITE_URL}${path ?? window.location.pathname}`;
    const img = image ?? DEFAULT_IMAGE;

    document.title = fullTitle;
    setMeta("name", "description", description);
    upsertLink("canonical", url);
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, nofollow" : "index, follow"
    );

    // Open Graph
    upsertMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:site_name", SITE_NAME);

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);
  }, [title, description, path, image, type, noindex, titleTemplate]);
}

/** Inject a JSON-LD structured-data block; removed automatically on unmount. */
export function useJsonLd(id: string, data: unknown | null) {
  const serialized = data == null ? "" : JSON.stringify(data);
  useEffect(() => {
    const elId = `ld-${id}`;
    if (!serialized) {
      document.getElementById(elId)?.remove();
      return;
    }
    let el = document.getElementById(elId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = elId;
      document.head.appendChild(el);
    }
    el.textContent = serialized;
    return () => {
      document.getElementById(elId)?.remove();
    };
  }, [id, serialized]);
}
