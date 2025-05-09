import { Context } from "@hono/hono";
import type { DConfig, DEnv, DHono } from "../types.ts";

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
const getPolicies = (ctx: Context<DEnv>) => {
  // @ts-ignore: all properties will be set
  const csp: typeof default_policies = {};
  for (const [k, v] of Object.entries(default_policies)) {
    const key = k as keyof typeof default_policies;
    csp[key] = [...v];
    const xkey = `x-${key}`;
    if (ctx.res.headers.has(xkey)) {
      const value = ctx.res.headers.get(xkey) as string;
      ctx.res.headers.delete(xkey);
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

export const middleware = (hono: DHono, _config: DConfig) => {
  hono.use("/*", async (ctx, next) => {
    await next();
    if (ctx.env.devMode) {
      return;
    }
    try {
      // if (!ctx.res) return;
      const csp = getPolicies(ctx);
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
