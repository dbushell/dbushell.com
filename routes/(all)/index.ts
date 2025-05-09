import { DHono, DRoute } from "@src/types.ts";
import { toText } from "@std/streams";
import { manifest } from "@src/content/manifest.ts";

const headers = [
  ["x-frame-options", "DENY"],
  ["x-xss-protection", "1; mode=block"],
  ["x-content-type-options", "nosniff"],
  ["permissions-policy", "browsing-topics=(),interest-cohort=()"],
  ["referrer-policy", "same-origin"],
  ["speculation-rules", '"/speculation-rules.json"'],
  ["x-img-src", "data:"],
  // TODO - generate? - Hash for Logo inline styles
  ["x-style-src", `'sha256-b3S6PPNQCR5hunY6m2WZDOVKfLngmPu01uGVlDvKO6I='`],
  // Inline <head>
  ["x-script-src", `'sha256-DYG3/n9nLF/8vTTz0BeAfjdDVBb8OnKj3cIKV9cY+XU='`],
  // "this.rel=`stylesheet`"
  ["x-script-src", `'unsafe-hashes'`],
  ["x-script-src", `'sha256-BGXQRYq/G9+8wEtSYSbQRnDRz8/8apfi/W/CUBMh9w0='`],
  // Allow search WASM and fallback
  ["x-script-src", `'wasm-unsafe-eval'`],
  ["x-form-action", `https://duckduckgo.com`],
  ["x-form-action", `https://contact.dbushell.com`],
  ["x-connect-src", `https://contact.dbushell.com`],
];

export const order = 999;

export const middleware = (hono: DHono, route: DRoute) => {
  hono.use(route.pattern, async (ctx, next) => {
    await next();
    if (ctx.res.body === null) {
      return;
    }
    const url = new URL(ctx.req.url);
    const content_type = ctx.res.headers.get("content-type");
    if (
      content_type?.includes("text/html") ||
      content_type?.includes("text/javascript")
    ) {
      // Replace hashes
      let body = await toText(ctx.res.body);
      body = body.replaceAll("%DEPLOY_HASH%", () => ctx.env.deployHash);

      // Inject inline styles
      let stylesHTML = "";
      for (const { css, hash } of manifest.styles) {
        stylesHTML += `<style data-hash="${hash}">${css}</style>\n`;
      }
      body = body.replace("%STYLES%", () => stylesHTML);

      if (ctx.env.devMode) {
        body = body.replaceAll(ctx.env.origin.href, "/");
        body = body.replaceAll('decoding="async"', 'decoding="sync"');
        body = body.replaceAll('fetchpriority="low"', 'fetchpriority="high"');
        body = body.replaceAll('loading="lazy"', 'loading="eager"');
      }

      // Replace response
      const bytes = new TextEncoder().encode(body);
      ctx.res = new Response(bytes);
      ctx.header("content-type", content_type);
      ctx.header("content-length", String(bytes.byteLength));
    }

    for (const [k, v] of headers) {
      ctx.header(k, v, {
        append: k.startsWith("x-"),
      });
    }
    for (const { hash } of manifest.styles) {
      ctx.header("x-style-src", `'sha256-${hash}'`, {
        append: true,
      });
    }
    if (url.pathname.startsWith("/speculation-rules.json")) {
      ctx.header("content-type", "application/speculationrules+json");
    }
  });
};
