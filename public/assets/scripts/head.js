/// <reference lib="dom" />
const deployHash = "%DEPLOY_HASH%";

// Handle service worker
if ("serviceWorker" in globalThis.navigator) {
  globalThis.navigator.serviceWorker.register(`/sw.js?v=${deployHash}`);
}

const viewTransition = typeof document.startViewTransition === "function"
  ? (props) => document.startViewTransition(props)
  : (props) => ({
    finished: Promise.resolve(props()),
  });

// Handle dark mode
document.querySelectorAll('input[name="appearance"]').forEach(($input) => {
  if ($input.value === localStorage.getItem("theme")) {
    $input.checked = true;
  }
  $input.addEventListener("input", (ev) => {
    globalThis.__setTheme(ev.target.value);
  });
});

document.querySelectorAll("dialog").forEach(($dialog) => {
  $dialog.addEventListener("cancel", (ev) => {
    ev.preventDefault();
    viewTransition(() => {
      $dialog.close();
    });
  });
});

document.querySelectorAll('button[popovertarget="settings"]').forEach(
  ($button) => {
    $button.addEventListener("click", (ev) => {
      const $dialog = document.getElementById(
        $button.getAttribute("popovertarget"),
      );
      if (!$dialog) return;
      ev.preventDefault();
      viewTransition(() => {
        if ($dialog.open) {
          $dialog.close();
        } else {
          $dialog.showModal();
        }
      });
    });
  },
);

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

const gramm = document.createElement("p");
gramm.classList.add("FU-Gramm");
gramm.innerHTML =
  `<a href="/notes/2025-03-28T17:54Z/">The Grammarly extension is breaking my website. Please disable it to avoid issues!</a>`;

/** @type {MutationCallback} */
const callback = (mutationList, _observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((n) => {
        if (n.nodeName.toLowerCase().includes("gramm")) {
          n.parentNode.removeChild(n);
          document.documentElement.classList.add("fu-gramm");
          document.documentElement.append(gramm);
        }
      });
    }
  }
};

const observer = new MutationObserver(callback);

observer.observe(document.documentElement, {
  attributes: false,
  childList: true,
  subtree: false,
});
