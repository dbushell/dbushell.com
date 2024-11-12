import * as fs from "@std/fs";
import * as path from "@std/path";
import { crypto } from "@std/crypto";
import { encodeHex } from "@std/encoding";
import { extractYaml } from "@std/front-matter";
import { TextLineStream, toText } from "@std/streams";
import { excerpt, stripTags } from "@dbushell/hyperless";
import markdown, { hmmtypography } from "@src/markdown.ts";
import type { FrontProps, NoteProps, Props } from "./types.ts";

const DEV = Deno.args.includes("--dev");

const dataPath = path.resolve(Deno.cwd(), "src/data");
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
    return JSON.parse(await Deno.readTextFile(pathname));
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
  props.body = props.body.replace(
    /{{([^{].*?)}}/gs,
    (...m) => (`{{!${m[1]}}}`),
  );
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
  }

  if (Deno.args.includes("--snapshot")) {
    let snap = `${props.href.slice(1, -1).replaceAll("/", "-")}.html`;
    snap = path.join(snapshotPath, snap);
    await Deno.writeTextFile(
      snap,
      props.body.replace(/syntax-\d+/g, ""),
    );
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

export const readArticles = async (): Promise<Props[]> => {
  const arr = await readGlob(path.join(dataPath, `blog/**/*.md`));
  arr.sort((
    a,
    b,
  ) => ((a.date?.valueOf() ?? 0) < (b.date?.valueOf() ?? 0) ? 1 : -1));
  return arr;
};

export const readPages = async (): Promise<Props[]> => {
  const [a, b] = await Promise.all([
    readGlob(path.join(dataPath, `pages/**/*.md`)),
    readGlob(path.join(dataPath, `portfolio/**/*.md`)),
  ]);
  const arr = [...a, ...b];
  return arr;
};

export const readNotes = async (): Promise<NoteProps[]> => {
  const props: Array<NoteProps> = [];
  for await (
    const entry of fs.walk(path.join(dataPath, `notes`), {
      match: [/\/\d{4}\.md$/],
    })
  ) {
    const file = await Deno.open(entry.path);
    const data: Array<Array<string>> = [];
    const stream = file.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());
    for await (const line of stream) {
      if (line.length === 17 && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(line)) {
        data.push([line]);
      } else if (data.length) {
        data?.at(-1)?.push(line);
      }
    }
    const promises = [];
    for (const [dateStr, ...lines] of data) {
      if (markdown.length === 0) continue;
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) continue;
      promises.push(
        markdown(lines.join("\n")).then((body) => {
          // Escape Hypermore props
          body = body.replace(
            /{{([^{].*?)}}/gs,
            (...m) => (`{{!${m[1]}}}`),
          );
          props.push({
            date,
            body,
            href: `/notes/${date.toISOString().slice(0, 16)}Z/`,
          });
        }),
      );
    }
    await Promise.all(promises);
  }
  props.sort((a, b) => b.date.getTime() - a.date.getTime());
  return props;
};
