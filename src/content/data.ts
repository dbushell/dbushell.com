import * as fs from "@std/fs";
import * as path from "@std/path";
import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding";
import { extractYaml } from "@std/front-matter";
import { toText } from "@std/streams";
import { excerpt, stripTags } from "@dbushell/hyperless";
import { encodeHash } from "../utils.ts";
import { hmmtypography, markdown } from "./markdown.ts";
import type { FrontProps, Props } from "./types.ts";

const DEV = Deno.args.includes("--dev");

const cachePath = path.join(Deno.cwd(), ".cache");
const snapshotPath = path.join(Deno.cwd(), ".snapshot");

if (DEV) {
  await fs.emptyDir(cachePath);
}

export const readProps = async (srcPath: string): Promise<Props> => {
  // Read markdown
  const file = await Deno.open(srcPath);
  const [tee1, tee2] = file.readable.tee();
  const [hash, src] = await Promise.all([
    crypto.subtle.digest("FNV32A", tee1).then(encodeHex),
    toText(tee2),
  ]);

  // Check cached props
  const pathname = path.join(cachePath, `${hash}.json`);
  if (DEV && (await fs.exists(pathname))) {
    return JSON.parse(
      await Deno.readTextFile(pathname),
      (key: string, value: unknown) => {
        if (key === "date" && typeof value === "string") {
          return new Date(value);
        }
        return value;
      },
    );
  }

  // Parse front matter
  const matter = extractYaml<FrontProps>(src);
  const props: Props = {
    features: matter.attrs.features ?? [],
    href: `/${matter.attrs.slug}/`,
    title: matter.attrs.title,
    body: matter.body,
    excerpt: "",
    container: "page",
    changefreq: "monthly",
    priority: "0.8",
    src: srcPath,
  };
  if (/\/showcase\//.test(props.href)) {
    props.priority = "0.5";
  }

  // Pass title and description through Marked for smartypants
  props.title = await hmmtypography(props.title);
  props.title = stripTags(props.title).trim();

  if (matter.attrs.description) {
    props.description = await markdown(matter.attrs.description);
    props.description = stripTags(props.description).trim();
  }

  // Pass body through Marked for full HTML
  props.body = await markdown(props.body);
  // Escape Hypermore props
  props.body = props.body.replace(/{{([^{].*?)}}/gs, (...m) => `{{!${m[1]}}}`);
  props.excerpt = excerpt(props.body);

  // Blog date and slug
  if (matter.attrs.date) {
    props.container = "article";
    props.priority = "0.6";
    props.date = new Date(matter.attrs.date);
    props.href = "/" +
      [
        props.date.getFullYear(),
        `${props.date.getMonth() + 1}`.padStart(2, "0"),
        `${props.date.getDate()}`.padStart(2, "0"),
        matter.attrs.slug,
      ].join("/") +
      "/";
    props.hash = await encodeHash(props.href);
  }

  if (Deno.args.includes("--snapshot")) {
    let snap = `${props.href.slice(1, -1).replaceAll("/", "-")}.html`;
    snap = path.join(snapshotPath, snap);
    await Deno.writeTextFile(snap, props.body.replace(/syntax-\d+/g, ""));
  }

  // Save cached props
  if (DEV) {
    await Deno.writeTextFile(pathname, JSON.stringify(props));
  }

  return props;
};

export const readGlob = async (glob: string): Promise<Props[]> => {
  const arr: Props[] = [];
  const promises = [];
  for await (const entry of fs.expandGlob(glob)) {
    if (!entry.isFile || !/.md$/.test(entry.name)) {
      continue;
    }
    promises.push(
      readProps(entry.path).then((props) => {
        if (props) arr.push(props);
      }),
    );
  }
  await Promise.allSettled(promises);
  return arr;
};

export const readArticles = async (dir: string): Promise<Props[]> => {
  const arr = await readGlob(path.join(dir, `blog/**/*.md`));
  return arr
    .filter((props) => {
      if (DEV !== true && Array.isArray(props.features)) {
        return props.features.includes("draft") === false;
      }
      if (DEV && props.features?.includes("draft")) {
        props.title = `🚫 ${props.title}`;
      }
      return true;
    })
    .toSorted((a, b) => {
      return b.date!.getTime() - a.date!.getTime();
    });
};

export const readPages = async (dir: string): Promise<Props[]> => {
  const [a, b] = await Promise.all([
    readGlob(path.join(dir, `pages/**/*.md`)),
    readGlob(path.join(dir, `portfolio/**/*.md`)),
  ]);
  const arr = [...a, ...b];
  return arr;
};
