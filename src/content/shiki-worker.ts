/// <reference lib="webworker" />

import * as shiki from "shiki";
import { transformerRenderWhitespace } from "@shikijs/transformers";

const theme = "dracula";

const colorReplacements = {
  "#6272a4": "#a3b5eb", // Grey
  "#ff79c6": "#ff93ce", // Pink
  "#bd93f9": "#caa7ff", // Purple
};

const transformers = [transformerRenderWhitespace()];

const warn = (str: string) => {
  console.warn(`%c⚠ ${str}`, "color: yellow;");
};

self.addEventListener("message", (ev: MessageEvent) => {
  const { code, lang } = ev.data;
  if (!Object.hasOwn(shiki.bundledLanguages, lang)) {
    if (lang !== "text") warn(`Unknown language: "${lang}"`);
  }
  if (typeof code === "string" && typeof lang === "string") {
    render(code, lang);
  } else {
    warn(`Missing data`);
    self.postMessage({ code: "" });
  }
});

const render = async (code: string, lang: string) => {
  try {
    code = await shiki.codeToHtml(code, {
      lang,
      theme,
      colorReplacements,
      transformers,
    });
  } catch (err) {
    const error = err as Error;
    warn(`${error.name}: ${error.message}`);
    code = "";
  }
  self.postMessage({ code });
};
