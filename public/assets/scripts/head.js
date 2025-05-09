/// <reference lib="dom" />
const deployHash = "%DEPLOY_HASH%";

if ("serviceWorker" in globalThis.navigator) {
  globalThis.navigator.serviceWorker.register(`/sw.js?v=${deployHash}`);
}

export const viewTransition = typeof document.startViewTransition === "function"
  ? (props) => document.startViewTransition(props)
  : (props) => ({
    finished: Promise.resolve(props()),
  });

export const onReady = (fn) => {
  if (/complete|interactive|loaded/.test(document.readyState)) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
};

onReady(() => {
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

  const elements = [
    "contact-form",
    "glossary-term",
    "smart-arse",
  ];
  for (const name of elements) {
    if (document.querySelector(name) === null) {
      continue;
    }
    const script = document.createElement("script");
    script.type = "module";
    script.fetchPriority = "low";
    script.src = `/assets/scripts/${name}.js`;
    document.body.append(script);
  }
});

if (document.querySelector("code")) {
  new FontFace(
    "0xProto",
    `url('/assets/fonts/0xProto-Regular.woff2') format('woff2')`,
    { weight: "400" },
  )
    .load()
    .then((font) => document.fonts.add(font));
  new FontFace(
    "0xProto",
    `url('/assets/fonts/0xProto-Bold.woff2') format('woff2')`,
    { weight: "700" },
  )
    .load()
    .then((font) => document.fonts.add(font));
  new FontFace(
    "0xProto",
    `url('/assets/fonts/0xProto-Italic.woff2') format('woff2')`,
    { weight: "400", style: "italic" },
  )
    .load()
    .then((font) => document.fonts.add(font));
}

const gramm = document.createElement("p");
gramm.classList.add("🤡");
gramm.innerHTML =
  `<a href="/2025/03/29/et-tu-grammarly/">The Grammarly extension is breaking my website. Please disable it to avoid issues!</a>`;
let caught = false;

/** @type {MutationCallback} */
const callback = (mutationList, _observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      mutation.addedNodes.forEach((n) => {
        if (n.nodeName.toLowerCase().includes("grammarly")) {
          n.parentNode.removeChild(n);
          if (!caught) {
            document.documentElement.append(gramm);
            caught = true;
          }
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

if (globalThis.location.hostname === "localhost") {
  import("./localhost.js");
}
