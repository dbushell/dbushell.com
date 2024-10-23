import { encodeBase64 } from "@std/encoding";
import { Queue } from "@dbushell/carriageway";
import { hmmarkdown, hmmtypography } from "@dbushell/hmmarkdown";
import { Node, parseHTML, unescape } from "@dbushell/hyperless";
export { hmmtypography };

/** Style languages as plain text */
const textCode = new Set(["", "plain", "text", "txt"]);

type SCV = { queue: Queue<Node, void>; worker: Worker };

const workers: Array<SCV> = [];
for (let i = 0; i < Math.min(3, navigator.hardwareConcurrency - 1); i++) {
  workers.push({
    queue: new Queue<Node, void>({ concurrency: 1 }),
    worker: new Worker(import.meta.resolve("./shiki-worker.ts"), {
      type: "module",
    }),
  });
}

const getSCV = (): SCV => {
  workers.sort((a, b) => b.queue.length - a.queue.length);
  return workers.at(-1)!;
};

export const cssMap = new Map<string, string>();
const styleAttr = /style=(["'])(.*?)\1/g;

/** Strip `<code>` inline styles and map to class */
const stripStyles = (code: string) => {
  return code.replace(styleAttr, (...args: Array<string>) => {
    if (!cssMap.has(args[2])) {
      cssMap.set(args[2], `syntax-${cssMap.size}`);
    }
    return `class="${cssMap.get(args[2])}"`;
  });
};

/** Get code syntax CSS and CSP hash */
export const syntaxCSS = async () => {
  let css = [...cssMap.entries()].map(([k, v]) => `.${v}{${k};}`).join("");
  css = `@layer syntax{${css}}`;
  const hash = encodeBase64(
    new Uint8Array(
      await crypto.subtle.digest("sha-256", new TextEncoder().encode(css)),
    ),
  );
  return { css, hash };
};

// Transform anchor elements
const anchorNode = (a: Node) => {
  const href = a.attributes.get("href")!;
  const url = /^[\/|#]/.test(href)
    ? new URL(href, "https://dbushell.com")
    : new URL(href);
  const excludePaths = ["/tip/", "/mastodon/"];
  a.attributes.set("href", href[0] === "#" ? url.hash : url.href);
  if (
    url.hostname !== "dbushell.com" || excludePaths.includes(url.pathname)
  ) {
    a.attributes.set("rel", "noopener noreferrer");
    a.attributes.set("target", "_blank");
  }
};

// Transform image elements
const imageNode = (img: Node) => {
  const href = img.attributes.get("src")!;
  const url = href[0] === "/"
    ? new URL(href, "https://dbushell.com")
    : new URL(href);
  img.attributes.set("src", url.href);
  img.attributes.set("decoding", "async");
  img.attributes.set("fetchpriority", "low");
  img.attributes.set("loading", "lazy");
  const figure = img.closest((n) => n.tag === "figure");
  if (figure === null) {
    const figure = new Node(null, "ELEMENT", "", "figure");
    figure.attributes.set("class", "Image");
    img.replace(figure);
    figure.append(img);
  }
};

const markdown = async (md: string): Promise<string> => {
  const html = await hmmarkdown(md);
  const node = parseHTML(html);
  const pre: Array<Node> = [];

  // Custom transforms
  node.traverse((n) => {
    if (n.tag === "a") anchorNode(n);
    if (n.tag === "img") imageNode(n);
    if (n.tag === "pre") pre.push(n);
  });

  await Promise.all(pre.map((n) => {
    let lang = n.attributes.get("data-lang") ?? "text";
    // Unescape and remove wrapper
    let code = unescape(n.children[0].raw);
    code = code.replace(/^<code>(.+)<\/code>$/s, (...m) => (m[1]));
    if (textCode.has(lang)) lang = "text";
    // Highlight syntax in worker
    const scv = getSCV();
    return scv.queue.append(n, async () => {
      const deferred = Promise.withResolvers<void>();
      scv.worker.postMessage({ code, lang });
      scv.worker.addEventListener("message", (ev: MessageEvent) => {
        code = ev.data.code ?? "";
        deferred.resolve();
      }, { once: true });
      await deferred.promise;
      // Remove shiki wrapper
      code = code.replace(/^<pre[^>]*?>(.+)<\/pre>$/s, (...m) => (m[1]));
      code = stripStyles(code);
      n.children[0].raw = code;
    });
  }));

  return node.toString();
};

export default markdown;
