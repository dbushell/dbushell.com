/// <reference lib="dom" />
const MAX_RESULTS = 10;

export class Component extends HTMLElement {
  #pagefind;
  #defaultItems;
  /** @type {Map<string, HTMLLIElement>} */
  #items = new Map();

  static observedAttributes = ["disabled"];
  /** @type {ElementInternals} */
  #internals;

  /** @returns {HTMLFormElement} */
  get searchForm() {
    return this.querySelector("search form");
  }

  /** @returns {HTMLInputElement} */
  get searchInput() {
    return this.searchForm.querySelector("input[type='search']");
  }

  /** @return {HTMLButtonElement} */
  get clearButton() {
    return this.searchForm.querySelector("[type='button']");
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
    this.#defaultItems = [...this.searchList.querySelectorAll("li")];
    this.searchInput.addEventListener("focus", () => {
      this.#setup();
    }, { once: true });
    this.clearButton.addEventListener("click", () => {
      this.#clear();
      this.searchInput.value = "";
      this.searchInput.focus();
    });
  }

  async #setup() {
    // Import module
    this.#pagefind = await import("/_search/pagefind.js");
    this.#pagefind.init();

    // Disable fallback
    this.searchForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
    });

    this.searchInput.addEventListener("input", () => this.#search());
  }

  #clear() {
    this.searchList.innerHTML = "";
    this.searchList.append(...this.#defaultItems);
    this.#internals.states.delete("active");
  }

  async #search() {
    // Show latest items for empty query
    if (this.searchInput.value === "") {
      this.#clear();
      return;
    }

    this.#internals.states.add("active");
    this.#internals.states.add("searching");

    // Debounce search
    const data = await this.#pagefind.debouncedSearch(this.searchInput.value);
    if (data === null) return;

    // Fetch top resunts
    const results = await Promise.all(
      data.results.slice(0, MAX_RESULTS).map((item) => item.data()),
    );

    // Clear and update items
    this.searchList.innerHTML = "";
    for (const item of results) {
      // Create <li> once per URL
      if (this.#items.has(item.url) === false) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = item.url;
        a.textContent = item.meta.title;
        li.append(a);
        this.#items.set(item.url, li);
      }
      // Append <li>
      const li = this.#items.get(item.url);
      this.searchList.append(li);
    }

    this.#internals.states.delete("searching");
  }
}

globalThis.customElements.define("search-form", Component);
