import * as fs from "@std/fs";
import { assert } from "@std/assert";
import { Node } from "@dbushell/hyperless";
import { hmmarkdown } from "./markdown.ts";
import type { TermProps } from "./types.ts";

export const glossary = new Map<string, TermProps>();

export const rebuildGlossary = async (
  dir: string,
): Promise<Map<string, TermProps>> => {
  glossary.clear();
  for await (
    const entry of fs.walk(dir, {
      match: [/\.json$/],
    })
  ) {
    if (entry.name.startsWith("_")) continue;
    const text = await Deno.readTextFile(entry.path);
    try {
      const data = JSON.parse(text);
      for (const prop of ["title", "description", "links"]) {
        assert(prop in data);
      }
      data.description = await hmmarkdown(data.description);
      glossary.set(entry.name.replace(/\.json$/, ""), data);
    } catch {
      console.error(`Bad glossary term: ${entry.name}`);
    }
  }
  return glossary;
};

export const enhanceAnchor = (node: Node, url: URL | undefined) => {
  url ??= new URL(node.attributes.get("href")!);
  const parts = url.pathname.split("/").filter((p) => p.length > 0);
  if (parts.at(0) !== "glossary") {
    return;
  }
  const key = parts[1].split(/[^\w-]/)[0];
  const term = glossary.get(key);
  if (term) {
    const component = new Node(null, "ELEMENT", "", "glossary-term");
    component.attributes.set("id", `--term-${key}`);
    node.replace(component);
    component.append(node);
    node.attributes.set("href", term.links[0].url);
    if (!term.links[0].url.startsWith("/")) {
      node.attributes.set("rel", "noopener noreferrer");
      node.attributes.set("target", "_blank");
    }
  } else {
    const str = `Missing glossary term: ${key}`;
    console.warn(`%c⚠ ${str}`, "color: yellow;");
  }
};
