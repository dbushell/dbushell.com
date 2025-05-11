export class Component extends HTMLElement {
  static observedAttributes = ["duration"];

  /** @type {ElementInternals} */
  #internals;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  connectedCallback() {
    if (this.#internals.states.has("connected")) {
      return;
    }
    this.#internals.states.add("connected");
    if (globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const words = this.textContent.split(/\b/);
    const text = document.createElement("span");
    text.innerHTML = this.innerHTML;
    this.innerHTML = "";
    this.append(text);
    let i = 0;
    for (const word of words) {
      const w = document.createElement("span");
      w.ariaHidden = true;
      for (const char of word.split("")) {
        const c = document.createElement("span");
        c.style.setProperty("--i", i++);
        c.textContent = char;
        w.append(c);
      }
      this.append(w);
    }
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    if (name === "duration") {
      const duration = Number.parseFloat(newValue);
      if (Number.isNaN(duration)) {
        this.style.removeProperty("--duration");
      } else {
        this.style.setProperty("--duration", `${duration}ms`);
      }
    }
  }
}

globalThis.customElements.define("smart-arse", Component);
