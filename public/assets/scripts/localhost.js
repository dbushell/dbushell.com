import { onReady } from "./head.js";

onReady(() => {
  for (const prose of document.querySelectorAll(".Prose")) {
    const ac = new AbortController();
    prose.addEventListener("pointerdown", (ev) => {
      if (ev.buttons == 2) {
        prose.setAttribute("contenteditable", "");
        prose.setAttribute("spellcheck", "true");
        setTimeout(() => prose.focus(), 1);
        ac.abort();
      }
    }, { signal: ac.signal });
  }
});
