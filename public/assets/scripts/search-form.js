/// <reference lib="dom" />

import { viewTransition } from "./head.js";
import { normalizeWords } from "./normalize.js";

const raf = globalThis.requestAnimationFrame;

export class Component extends HTMLElement {
  /** @type {HTMLLIElement[]} */
  #defaultItems;

  /** @type {Map<string, HTMLLIElement>} */
  #items = new Map();

  static observedAttributes = ["disabled"];
  /** @type {ElementInternals} */
  #internals;

  /** @type {Worker} */
  #worker;

  /** @type {TextDecoder} */
  #decoder = new TextDecoder();

  /** @type {ReturnType<setTimeout>} */
  #debounce;

  #searching = false;

  /** @type {PromiseWithResolvers<void>} */
  #loading = Promise.withResolvers();

  /** @returns {HTMLFormElement} */
  get searchForm() {
    return this.querySelector("search form");
  }

  /** @returns {HTMLInputElement} */
  get searchInput() {
    return this.searchForm.querySelector(".Field");
  }

  /** @return {HTMLButtonElement} */
  get clearButton() {
    return this.searchForm.querySelector(".Button");
  }

  /** @return {HTMLUListElement} */
  get searchList() {
    return this.querySelector("ul");
  }

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    this.clearButton.textContent = "Clear";
    this.clearButton.setAttribute("type", "button");
    this.#defaultItems = [...this.searchList.querySelectorAll("li")];
    for (const item of this.#defaultItems) {
      this.#items.set(item.id, item);
    }
    this.searchInput.addEventListener("focus", () => {
      this.#setup();
    }, { once: true });
    this.clearButton.addEventListener("click", () => {
      this.#clear();
      this.searchInput.value = "";
      this.searchInput.focus();
    });
  }

  #setup() {
    this.#worker = new Worker(
      "/assets/scripts/search-worker.js",
      { type: "module" },
    );
    // Disable fallback
    this.searchForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      this.#search();
    });
    // Debounce user input
    this.searchInput.addEventListener("input", () => {
      clearTimeout(this.#debounce);
      this.#debounce = setTimeout(() => {
        this.#search();
      }, 100);
    });
    this.#worker.addEventListener("message", (ev) => {
      if (ev.data.type === "ready") {
        this.#loading.resolve();
      }
      if (ev.data.type === "results") {
        try {
          const data = JSON.parse(this.#decoder.decode(ev.data.buffer));
          this.#update(data);
        } catch (err) {
          console.error(err);
          this.#clear();
        } finally {
          this.#searching = false;
        }
      }
    });
  }

  #clear() {
    this.#internals.states.add("searching");
    viewTransition(() => {
      this.searchList.innerHTML = "";
      this.searchList.append(...this.#defaultItems);
      this.#internals.states.delete("active");
      raf(() =>
        raf(() => {
          this.#internals.states.delete("searching");
        })
      );
    });
  }

  async #search(bypass = false) {
    if (this.#searching || bypass === false) {
      clearTimeout(this.#debounce);
      this.#debounce = setTimeout(() => {
        this.#search(true);
      }, 100);
      return;
    }
    // Show latest items for empty query
    if (this.searchInput.value === "") {
      this.#clear();
      return;
    }
    await this.#loading.promise;

    const words = normalizeWords(
      this.searchInput.value.substring(0, 50),
    ).filter((w) => w.length > 2);

    if (words.length) {
      this.#internals.states.add("active");
      this.#internals.states.add("searching");
      this.#searching = true;
      this.#worker.postMessage({ type: "search", words });
    }
  }

  /**
   * Update search list
   * @param {[string,string,string][]} data
   */
  #update(data) {
    viewTransition(() => {
      this.searchList.innerHTML = "";
      for (const item of data) {
        const [hash, href, title] = item;
        const id = `search-${hash}`;
        if (this.#items.has(id) === false) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = href;
          a.textContent = title;
          li.id = id;
          li.append(a);
          this.#items.set(id, li);
        }
        const li = this.#items.get(id);
        this.searchList.append(li);
      }
      raf(() =>
        raf(() => {
          this.#internals.states.delete("searching");
        })
      );
    });
  }
}

globalThis.customElements.define("search-form", Component);
