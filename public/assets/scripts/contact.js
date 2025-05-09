/// <reference lib="dom" />

export class Component extends HTMLElement {
  static observedAttributes = ["disabled"];
  /** @type {ElementInternals} */
  #internals;
  /** @type {HTMLFormElement | null} */
  #form;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.#form = null;
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

  set disabled(value) {
    this.toggleAttribute("disabled", value);
  }

  /** @returns {Array<HTMLElement>} */
  get fields() {
    if (!this.#form) return [];
    return Array.from(
      this.#form.querySelectorAll(":is(button, input, select, textarea)"),
    );
  }

  get prefersReducedMotion() {
    return globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  connectedCallback() {
    this.#form = this.querySelector("form");
    this.#form?.addEventListener("submit", (ev) => this.#onSubmit(ev));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "disabled") {
      /** @type {Set<string>} */
      const states = this.#internals.states;
      if (this.disabled) {
        states.add("disabled");
      } else {
        states.delete("disabled");
      }
      for (const element of this.fields) {
        element.toggleAttribute("disabled", this.disabled);
      }
    }
  }

  setNotice(success, value) {
    const message = document.createElement("p");
    message.innerHTML = `<strong></strong>`;
    message.className = success ? "Success" : "Error";
    message.querySelector("strong").innerText = value;
    this.#form?.replaceWith(message);
    this.scrollIntoView({
      behavior: this.prefersReducedMotion ? "instant" : "smooth",
      block: "start",
    });
  }

  async #onSubmit(ev) {
    if (!this.#form) return;
    ev.preventDefault();
    const formData = new FormData(this.#form);
    this.disabled = true;
    try {
      const response = await fetch(this.#form.action, {
        method: "POST",
        body: formData,
      });
      const { status } = response;
      if (status === 201) {
        this.setNotice(true, await response.text());
        return;
      } else if (status === 400 || status === 401) {
        this.setNotice(false, await response.text());
        console.debug(response);
        return;
      } else {
        console.debug(response);
        throw new Error();
      }
    } catch (err) {
      this.setNotice(
        false,
        "Error sending your enquiry. Please use the email address above.",
      );
      console.debug(err);
    }
  }
}

globalThis.customElements.define("contact-form", Component);
