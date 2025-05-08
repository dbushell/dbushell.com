import type { Hono } from "@hono/hono";
import type { Config } from "@src/types.ts";

const default_policies = {
  "child-src": ["'self'"],
  "connect-src": ["'self'"],
  "default-src": ["'self'"],
  "frame-src": ["'self'"],
  "font-src": ["'self'"],
  "img-src": ["'self'"],
  "manifest-src": ["'self'"],
  "media-src": ["'self'"],
  "object-src": ["'none'"],
  "prefetch-src": ["'self'"],
  "script-src": ["'self'"],
  "style-src": ["'self'"],
  "worker-src": ["'self'"],
  "base-uri": ["'none'"],
  "frame-ancestors": ["'none'"],
  "form-action": ["'self'"],
};

// Merge default CSP with `x-[policy]` response headers
const getPolicies = (response: Response) => {
  // @ts-ignore: all properties will be set
  const csp: typeof default_policies = {};
  for (const [k, v] of Object.entries(default_policies)) {
    const key = k as keyof typeof default_policies;
    csp[key] = [...v];
    const xkey = `x-${key}`;
    if (response.headers.has(xkey)) {
      const value = response.headers.get(xkey) as string;
      response.headers.delete(xkey);
      csp[key].push(...value.split(",").map((s) => `${s.trim()}`));
    }
  }
  // If `unsafe-inline` is present remove nonces and hashes
  if (csp["style-src"].includes(`'unsafe-inline'`)) {
    csp["style-src"] = csp["style-src"].filter(
      (s) => !(s.startsWith(`'nonce-`) || s.startsWith(`'sha256-`)),
    );
  }
  return csp;
};

export const middleware = (hono: Hono, _config: Config) => {
  hono.use("/*", async (ctx, next) => {
    await next();
    try {
      // if (!ctx.res) return;
      const csp = getPolicies(ctx.res);
      // Remove redundant policies
      if (csp["default-src"].includes("'self'")) {
        for (const [k, v] of Object.entries(csp)) {
          if (k === "default-src" || !k.endsWith("-src")) continue;
          if (v.length === 1 && v[0] === "'self'") {
            delete csp[k as keyof typeof csp];
          }
        }
      }
      ctx.res.headers.set(
        "content-security-policy",
        Object.entries(csp)
          .map(([k, v]) => `${k} ${v.join(" ")}`)
          .join("; "),
      );
    } catch (err) {
      // Headers probably immutable
      console.debug("csp middleware error");
      console.debug(err);
    }
  });
};
