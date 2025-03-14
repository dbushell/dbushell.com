/// <reference lib="dom" />
const deployHash = "%DEPLOY_HASH%";

// Handle service worker
if ("serviceWorker" in globalThis.navigator) {
  globalThis.navigator.serviceWorker.register(`/sw.js?v=${deployHash}`);
}

// Swap logo
/** @type {HTMLImageElement} */
const $logo = document.querySelector(".Logo img");
fetch($logo.src).then(async (response) => {
  if (!response.ok) return;
  const template = document.createElement("template");
  template.innerHTML = await response.text();
  $logo.replaceWith(template.content);
});

// Handle dark mode
const $doc = document.documentElement;
const $mode = document.querySelector(".Lightbulb");

if (localStorage.getItem("theme") === "dark") {
  $doc.dataset.theme = "dark";
}

$mode.addEventListener("click", () => {
  if ($doc.dataset.theme === "dark") {
    $doc.dataset.theme = "light";
    localStorage.setItem("theme", "light");
  } else {
    $doc.dataset.theme = "dark";
    localStorage.setItem("theme", "dark");
  }
});

const copyButtons = document.querySelectorAll("[data-copy^='pre']");
copyButtons.forEach((button) => {
  button.disabled = false;
  const codeId = button.dataset.copy;
  button.addEventListener("click", () => {
    navigator.clipboard.writeText(
      document.getElementById(codeId).textContent,
    ).then(() => {
      button.textContent = "Copied!";
    });
  });
});

// Handle monospace font
if (document.querySelector("code")) {
  new FontFace(
    "0xProto",
    `url('/assets/fonts/0xProto-Regular.woff2?v=2.202') format('woff2')`,
    { weight: "400" },
  )
    .load()
    .then((font) => document.fonts.add(font));
  new FontFace(
    "0xProto",
    `url('/assets/fonts/0xProto-Bold.woff2?v=2.202') format('woff2')`,
    { weight: "700" },
  )
    .load()
    .then((font) => document.fonts.add(font));
  new FontFace(
    "0xProto",
    `url('/assets/fonts/0xProto-Italic.woff2?v=2.202') format('woff2')`,
    { weight: "400", style: "italic" },
  )
    .load()
    .then((font) => document.fonts.add(font));
}

// Local development
if (globalThis.location.hostname === "localhost") {
  globalThis.addEventListener("load", () => {
    document.querySelectorAll(".Prose").forEach(($prose) => {
      $prose.addEventListener("click", (ev) => {
        const $link = ev.target.closest("[href]");
        if ($prose.hasAttribute("contenteditable")) {
          if ($link) globalThis.location.href = ev.target.href;
          return;
        }
        if ($link) return;
        $prose.setAttribute("contenteditable", "");
        $prose.setAttribute("spellcheck", "true");
        setTimeout(() => $prose.focus(), 1);
      });
    });
  });
}
