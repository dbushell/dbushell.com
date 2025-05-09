import { Env, Hono } from "@hono/hono";
import { JSONObject } from "@dbushell/hypermore";

export type DConfig = {
  devMode: boolean;
  rootDir: URL;
  publicDir: string;
  routesDir: string;
  templateDir: string;
  deployHash: string;
};

export type DEnv = Env & {
  Bindings: {
    info: Deno.ServeHandlerInfo<Deno.NetAddr>;
    deployHash: string;
  };
  Variables: {
    render: (html: string, props?: JSONObject) => Promise<string>;
  };
};

export type DHono = Hono<DEnv>;
