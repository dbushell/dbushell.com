import * as path from "@std/path";
import * as data from "./data.ts";
import { cssHash, cssMin } from "./css.ts";
import { syntaxCSS } from "./markdown.ts";
import { rebuildNotes } from "./notes.ts";
import { rebuildGlossary } from "./glossary.ts";
import type { Manifest, Props } from "./types.ts";

const data_dir = path.resolve(Deno.cwd(), "data");

export const generateManifest = async () => {
  const now = performance.now();
  console.log("Manifesting...");

  const manifest: Manifest = {
    routes: {},
    latest: [],
    notes: [],
    glossary: new Map(),
    styles: [
      {
        css: cssMin,
        hash: cssHash,
      },
    ],
  };

  manifest.glossary = await rebuildGlossary(
    path.join(data_dir, "glossary"),
  );

  manifest.routes["/"] = {
    container: "home",
    title: "Home",
    body: "",
    excerpt: "",
    href: "/",
    changefreq: "weekly",
    priority: "1.0",
  };

  manifest.routes["/contact/"] = {
    container: "contact",
    title: "Contact",
    body: "",
    excerpt: "",
    href: "/contact/",
    changefreq: "monthly",
    priority: "0.8",
  };

  for (const props of await data.readPages(data_dir)) {
    manifest.routes[props.href] = props;
  }

  const articleProps = await data.readArticles(data_dir);
  manifest.latest = articleProps
    .slice(0, 10)
    .map((props) => ({ ...props, body: "" }));
  for (const props of articleProps) {
    manifest.routes[props.href] = props;
  }

  {
    const noteProps = await rebuildNotes(path.join(data_dir, "notes"));
    manifest.notes = [...noteProps];
    let index = 0;
    while (noteProps.length > 0) {
      const notes = noteProps.splice(0, 20);
      const href = ++index === 1 ? `/notes/` : `/notes/page/${index}/`;
      const title = `Notes` + (index > 1 ? ` (page ${index})` : ``);
      let next = "";
      if (noteProps.length) {
        next = `/notes/page/${index + 1}/`;
      }
      let prev = "";
      if (index > 1) {
        prev = index === 2 ? "/notes/" : `/notes/page/${index - 1}/`;
      }
      const props: Props = {
        href,
        title,
        notes,
        next,
        prev,
        body: "",
        excerpt: "",
        changefreq: index === 1 ? "daily" : "weekly",
        priority: index === 1 ? "0.8" : "0.5",
        container: "notes",
      };
      manifest.routes[href] = props;
    }
  }

  {
    let index = 0;
    while (articleProps.length > 0) {
      const articles = articleProps.splice(0, 7);
      const href = ++index === 1 ? `/blog/` : `/blog/page/${index}/`;
      const title = `Blog` + (index > 1 ? ` (page ${index})` : ``);
      let next = "";
      if (articleProps.length) {
        next = `/blog/page/${index + 1}/`;
      }
      let prev = "";
      if (index > 1) {
        prev = index === 2 ? "/blog/" : `/blog/page/${index - 1}/`;
      }
      const props: Props = {
        href,
        title,
        articles,
        next,
        prev,
        body: "",
        excerpt: "",
        changefreq: index === 1 ? "weekly" : "monthly",
        priority: index === 1 ? "0.9" : "0.5",
        container: "archive",
      };
      manifest.routes[href] = props;
    }
  }

  manifest.styles.push(await syntaxCSS());

  console.log(`Manifested in ${(performance.now() - now).toFixed(2)}ms`);

  return manifest;
};

export let manifest: Manifest;

export const rebuildManifest = async () => {
  manifest = await generateManifest();
};
