/// <reference lib="webworker" />
import * as shiki from "shiki";
import { transformerRenderWhitespace } from "@shikijs/transformers";

const transformers = [transformerRenderWhitespace()];

self.addEventListener("message", (ev: MessageEvent) => {
  const { code, lang } = ev.data;
  if (!Object.hasOwn(shiki.bundledLanguages, lang)) {
    console.warn(`⚠ Unknown lang: "${lang}"`);
    // return;
  }
  if (typeof code === "string" && typeof lang === "string") {
    render(code, lang);
  } else {
    self.postMessage({ code: "" });
  }
});

const render = async (code: string, lang: string) => {
  code = await shiki.codeToHtml(code, {
    lang,
    theme: "dracula",
    colorReplacements: {
      "#6272a4": "#a3b5eb", // Grey
      "#ff79c6": "#ff93ce", // Pink
      "#bd93f9": "#caa7ff", // Purple
    },
    transformers,
  });
  self.postMessage({ code });
};
