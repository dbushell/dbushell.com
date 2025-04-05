import type { HyperHandle } from "@dbushell/hyperserve";
import { parseHTML } from "@dbushell/hyperless";
import { authorized } from "@src/shared.ts";
import { manifest } from "@src/manifest.ts";
import { randomSeeded } from "@std/random";

import specific from "@src/data/specific.json" with { type: "json" };
import nouns from "@src/data/nouns.json" with { type: "json" };
import verbs from "@src/data/verbs.json" with { type: "json" };
import adjectives from "@src/data/adjectives.json" with { type: "json" };

export const pattern = "/:year(\\d+)/:month(\\d+)/:day(\\d+)/:slug/";

const prng = randomSeeded(1337n);

const isVowel = (word: string): boolean => {
  return ["a", "e", "i", "o", "u"].includes(word[0]);
};

const isPrefix = (word: string): boolean => {
  return ["[", "(,", "“"].includes(word[0]);
};

const isSuffix = (word: string): boolean => {
  return ["”", ".", ",", "!", "?", "]", ")"].includes(word[0]);
};

const capitalizeWord = (word: string) => {
  return word[0].toUpperCase() + word.slice(1);
};

const specificWord = (input: string): [string, boolean] => {
  const lower = input.toLowerCase();
  for (const [key, values] of Object.entries(specific)) {
    if (values.includes(lower)) {
      return [key, true];
    }
  }
  return [input, false];
};

const randomWord = (input: string, list: string[]): [string, boolean] => {
  if (!list.includes(input.toLowerCase())) {
    return [input, false];
  }
  const replace = list[Math.floor(prng() * list.length)];
  return [replace, true];
};

const llmify = (body: string): string => {
  const node = parseHTML(body);
  node.traverse((n) => {
    if (n.type !== "TEXT") return;
    const node_words = n.raw.split(" ");
    for (let i = 0; i < node_words.length; i++) {
      let replace = node_words[i];
      let replaced = false;
      let prefix = "";
      let suffix = "";
      while (replace.length > 1 && isPrefix(replace[0])) {
        prefix = prefix + replace[0];
        replace = replace.slice(1);
      }
      while (replace.length > 1 && isSuffix(replace.at(-1)!)) {
        suffix = replace.at(-1) + suffix;
        replace = replace.slice(0, replace.length - 1);
      }
      [replace, replaced] = specificWord(replace);
      if (!replaced) {
        [replace, replaced] = randomWord(replace, verbs);
      }
      if (!replaced) {
        [replace, replaced] = randomWord(replace, adjectives);
      }
      if (!replaced) {
        [replace, replaced] = randomWord(replace, nouns);
      }
      if (!replaced) {
        if (/[^s]s$/.test(replace)) {
          [replace, replaced] = randomWord(
            replace.slice(0, replace.length - 1),
            nouns,
          );
          if (replace.at(-1) !== "s") {
            replace += "s";
          }
        }
      }
      if (replaced && i > 1) {
        if (node_words[i - 1] === "a" && isVowel(replace)) {
          node_words[i - 1] = "an";
        } else if (node_words[i - 1] === "an" && !isVowel(replace)) {
          node_words[i - 1] = "a";
        }
      }
      if (replaced && /^[A-Z]/.test(node_words[i])) {
        replace = capitalizeWord(replace);
      }
      node_words[i] = prefix + replace + suffix;
    }
    n.raw = node_words.join(" ");
  });
  return node.toString();
};

export const GET: HyperHandle = ({ request, match }) => {
  if (!authorized(request)) {
    return new Response(null, { status: 401 });
  }
  const url = new URL(request.url);
  const { year, month, day, slug } = match.pathname.groups;
  const href = `/${year}/${month}/${day}/${slug}/`;
  if (Object.hasOwn(manifest.routes, href)) {
    const latest = manifest.latest.map((props) => ({ ...props, body: "" }));
    const props = {
      ...manifest.routes[href],
      latest,
    };
    if (url.searchParams.has("llms")) {
      props.body = llmify(props.body);
    }
    return Response.json(props);
  }
  return new Response(null, { status: 400 });
};
