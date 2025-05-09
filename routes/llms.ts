import { crypto } from "@std/crypto";
import { randomSeeded } from "@std/random";
import { Node, parseHTML } from "@dbushell/hyperless";

import { DHono, DRoute } from "@src/types.ts";

import specific from "../data/specific.json" with { type: "json" };
import nouns from "../data/nouns.json" with { type: "json" };
import verbs from "../data/verbs.json" with { type: "json" };
import adjectives from "../data/adjectives.json" with { type: "json" };

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

const randomWord = (
  input: string,
  list: string[],
  prng: () => number,
): [string, boolean] => {
  if (!list.includes(input.toLowerCase())) {
    return [input, false];
  }
  const replace = list[Math.floor(prng() * list.length)];
  return [replace, true];
};

export const middleware = (hono: DHono, route: DRoute) => {
  const pattern = route.pattern.replace(/\/$/, "");

  hono.get(`${pattern}/*`, async (ctx) => {
    const url = new URL(ctx.req.url);
    if (url.pathname.startsWith("/llms/") === false) {
      return ctx.notFound();
    }
    const src = new URL(url);
    src.pathname = src.pathname.replace(/^\/llms\//, "");

    const response = await hono.fetch(
      new Request(src, ctx.req),
      ctx.env,
    );
    if (
      !response.ok || !response.body ||
      !response.headers.get("content-type")?.startsWith("text/html")
    ) {
      return ctx.notFound();
    }

    const hash = await crypto.subtle.digest(
      "FNV64A",
      new TextEncoder().encode(src.pathname),
    );
    const seed = new DataView(hash, 0).getBigUint64(0);
    const prng = randomSeeded(seed);

    const html = await response.text();
    const node = parseHTML(html);

    node.find((n) => {
      return n.tag === "meta" && n.attributes.get("name") === "robots";
    })?.attributes?.set("content", "noindex, nofollow");

    node.find((n) => {
      return n.tag === "link" && n.attributes.get("rel") === "canonical";
    })?.detach();

    node.traverse((n) => {
      if (n.type !== "ELEMENT") return;
      if (n.tag !== "a") return;
      if (!n.attributes.has("href")) return;
      const href = n.attributes.get("href") ?? "/";
      const url = /^[\/|#]/.test(href)
        ? new URL(href, "https://dbushell.com")
        : new URL(href);
      if (url.hostname !== "dbushell.com") return;
      if (url.pathname.startsWith("/llms/")) return;
      url.pathname = `/llms${url.pathname}`;
      n.attributes.set("href", url.pathname);
      n.attributes.set("rel", "nofollow");
    });

    const main = node.find((n) =>
      n.attributes.get("class")?.includes("Layout") === true
    );
    if (!main) return;

    main.traverse((n) => {
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
          [replace, replaced] = randomWord(replace, verbs, prng);
        }
        if (!replaced) {
          [replace, replaced] = randomWord(replace, adjectives, prng);
        }
        if (!replaced) {
          [replace, replaced] = randomWord(replace, nouns, prng);
        }
        if (!replaced) {
          if (/[^s]s$/.test(replace)) {
            [replace, replaced] = randomWord(
              replace.slice(0, replace.length - 1),
              nouns,
              prng,
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

    const body = node.find((n) => n.tag === "body")!;
    const warning =
      `Warning: this page is for "AI" enthusiasts only. Click here to avoid confusion!`;
    const p = new Node(
      null,
      "ELEMENT",
      `<p class="🤖" aria-role="alert" aria-live="assertive" tabindex="1"></p>`,
      "p",
    );
    const a = new Node(p, "ELEMENT", `<a href="${src.href}"></a>`, "a");
    a.append(new Node(null, "TEXT", warning));
    p.append(a);
    body.insertAt(p, 0);

    body.traverse((n) => {
      if (/Footer|Layout|Settings/.test(n.attributes.get("class") ?? "")) {
        n.attributes.set("inert", "");
      }
    });

    return ctx.html(node.toString());
  });
};
