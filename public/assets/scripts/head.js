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
const list = $doc.classList;

if (localStorage.getItem("darkmode") === "on") {
  list.remove("Lightmode");
  list.add("Darkmode");
}

$mode.addEventListener("click", () => {
  if (list.contains("Lightmode")) {
    list.remove("Lightmode");
    list.add("Darkmode");
    localStorage.setItem("darkmode", "on");
  } else {
    list.remove("Darkmode");
    list.add("Lightmode");
    localStorage.setItem("darkmode", "off");
  }
});

// Handle monospace font
if (document.querySelector("code")) {
  new FontFace(
    "Roboto Mono",
    `url('/assets/fonts/roboto-mono-variable.woff2?v=${deployHash}') format('woff2')`,
    { weight: "1 900" },
  )
    .load()
    .then((font) => document.fonts.add(font));
  new FontFace(
    "Roboto Mono",
    `url('/assets/fonts/roboto-mono-italic-variable.woff2?v=${deployHash}') format('woff2')`,
    { weight: "1 900", style: "italic" },
  )
    .load()
    .then((font) => document.fonts.add(font));
}
