import type { HyperHandle } from "@dbushell/hyperserve";
import { manifest } from "@src/manifest.ts";

export const middleware: HyperHandle = ({ request, platform }) => {
  const url = new URL(request.url);
  // Platform data
  platform.platformProps.deployHash = platform.deployHash;

  // Skip headers for internal API requests
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Known security policy headers
  // const pageHeaders: ServerData['pageHeaders'] = [
  const pageHeaders = [
    ["x-frame-options", "DENY"],
    ["x-xss-protection", "1; mode=block"],
    ["x-content-type-options", "nosniff"],
    ["permissions-policy", "browsing-topics=(),interest-cohort=()"],
    ["referrer-policy", "same-origin"],
    ["x-img-src", "data:"],
    // TODO - generate? - Hash for Logo inline styles
    ["x-style-src", `'sha256-kXLrG8qzlz0MMhgMvdF9YD6tca5CYXeC1iFSTHDsO8w='`],
  ];

  // Generated inline styles
  manifest.styles.forEach((style) => {
    pageHeaders.push(["x-style-src", `'sha256-${style.hash}'`]);
  });

  // CORS headers
  if (/\/(rss|sitemap)\.xml$/.test(url.pathname)) {
    pageHeaders.push(["access-control-allow-origin", "*"]);
  } else {
    pageHeaders.push(["access-control-allow-origin", "https://dbushell.com"]);
  }

  // Add strict security headers
  if (request.url.startsWith(Deno.env.get("ORIGIN")!)) {
    pageHeaders.push([
      "strict-transport-security",
      "max-age=63072000; includeSubDomains; preload",
    ]);
  }
  platform.platformProps.pageHeaders = pageHeaders;
};
