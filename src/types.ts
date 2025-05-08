import { Env, Hono } from "@hono/hono";

export type DConfig = {
  dev_mode: boolean;
  root_dir: URL;
  public_dir: string;
};

export type DEnv = Env & {
  Bindings: {
    info: Deno.ServeHandlerInfo<Deno.NetAddr>;
  };
};

export type DHono = Hono<DEnv>;
