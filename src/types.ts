import type { Context, Env, Hono } from "@hono/hono";
import type { JSONObject } from "@dbushell/hypermore";

declare module "@hono/hono" {
  interface ContextRenderer {
    (
      html: string | Promise<string>,
      props?: JSONObject,
    ): Promise<string>;
  }
}

export type DRoute = {
  pattern: string;
  hash: string;
};

export type DLoad = {
  ctx: Context<DEnv>;
  fetch: typeof fetch;
};

export type DModule = {
  load?: (props: DLoad) => Promise<JSONObject | null | undefined | void>;
  pattern?: string;
  order?: number;
};

export type DConfig = {
  devMode: boolean;
  origin: URL;
  rootDir: URL;
  publicDir: string;
  routeDir: string;
  templateDir: string;
  deployHash: string;
};

export type DEnv = Env & {
  Bindings: {
    info: Deno.ServeHandlerInfo<Deno.NetAddr>;
    origin: URL;
    devMode: boolean;
    deployHash: string;
  };
  // Variables: {
  //   render: (html: string, props?: JSONObject) => Promise<string>;
  // };
};

export type DHono = Hono<DEnv>;
