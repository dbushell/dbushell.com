import { Env, Hono } from "@hono/hono";
import { Hypermore } from "@dbushell/hypermore";

export type DConfig = {
  dev_mode: boolean;
  root_dir: URL;
  public_dir: string;
  template_dir: string;
};

export type DEnv = Env & {
  Bindings: {
    info: Deno.ServeHandlerInfo<Deno.NetAddr>;
  };
  Variables: {
    render: (...props: Parameters<Hypermore["render"]>) => Promise<string>;
  };
};

export type DHono = Hono<DEnv>;
