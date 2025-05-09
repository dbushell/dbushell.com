/// <reference lib="dom" />

import { onReady } from "./head.js";

/** @type {Component[]} */
const terms = [];

// Lazy load JSON definitions
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    if (entry.target instanceof Component) {
      observer.unobserve(entry.target);
      entry.target.load();
    }
  }
});

// Delegate global events for performance
onReady(() => {
  globalThis.addEventListener("scroll", () => {
    requestAnimationFrame(() => {
      for (const term of terms) term.update();
    });
  }, { passive: true });

  globalThis.addEventListener("resize", () => {
    requestAnimationFrame(() => {
      for (const term of terms) term.update();
    });
  }, { passive: true });

  globalThis.addEventListener("focus", () => {
    for (const term of terms) {
      if (term.isFocus()) term.show();
    }
  }, { passive: true, capture: true });

  globalThis.addEventListener("blur", () => {
    for (const term of terms) {
      if (!term.isFocus()) term.hide();
    }
  }, { passive: true, capture: true });
});

export class Component extends HTMLElement {
  /** @type {HTMLAnchorElement} */
  #anchor;

  /** @type {string} */
  #term;

  /** @type {{title: string; description: string; links: { title: string; url: string;}[];}} */
  #data = undefined;

  /** @type {boolean} */
  #open = false;

  /** @type {HTMLElement} */
  #card;

  /** @type {HTMLElement} */
  #placer;

  /** @type {PromiseWithResolvers<boolean>} */
  #ready = Promise.withResolvers();

  /** @type {ReturnType<setTimeout>} */
  #hideTimeout;

  /** Timestamp of `touchstart` event */
  #touch = 0;

  connectedCallback() {
    // Remove the "--term-" preffix
    this.#term = this.id.replace(/^--[^-]+-/, "");
    this.#anchor = this.querySelector("[href]");

    // Prefer popover for single tap touches
    const touchEnd = () => {
      setTimeout(() => {
        this.#touch = 0;
      }, Math.max(0, 350 - (Date.now() - this.#touch)));
    };
    this.#anchor.addEventListener("touchstart", (ev) => {
      if (ev.changedTouches.length !== 1) return;
      this.#touch = Date.now();
    }, { passive: true });
    this.#anchor.addEventListener("touchend", touchEnd);
    this.#anchor.addEventListener("touchcancel", touchEnd);
    this.#anchor.addEventListener("click", (ev) => {
      if (this.#touch > 0) {
        ev.preventDefault();
        this.show();
      }
    });

    // Handle hover
    this.addEventListener("mouseenter", () => {
      if (this.isHover()) this.show();
    }, true);
    this.addEventListener("mouseleave", () => {
      if (!this.isHover()) this.hide();
    }, true);

    onReady(() => {
      observer.observe(this);
    });

    terms.push(this);
  }

  /** @returns {boolean} */
  isHover() {
    const target = [...document.querySelectorAll(":hover")].at(-1);
    if (!target) return false;
    const parent = target.closest("glossary-term");
    return (parent === this);
  }

  /** @returns {boolean} */
  isFocus() {
    if (!document.activeElement) return false;
    const parent = document.activeElement.closest("glossary-term");
    return (parent === this);
  }

  /** @param {ToggleEvent} ev  */
  #beforeToggle(ev) {
    if (ev.newState === "open") {
      this.#open = true;
    }
    if (ev.newState === "closed") {
      // Return focus to anchor before dismissing popover
      if (this.isFocus()) this.#anchor.focus();
      this.#open = false;
    }
  }

  async show() {
    if (this.#open) return;
    if (this.#data === undefined) this.load();
    if (await this.#ready.promise === false) return;
    this.#card.dataset.opening = "true";
    this.#card.showPopover();
    this.update();
    globalThis.requestAnimationFrame(() => {
      this.update();
      delete this.#card.dataset.opening;
    });
  }

  hide() {
    clearTimeout(this.#hideTimeout);
    if (!this.#card) return;
    this.#hideTimeout = setTimeout(() => {
      if (this.isFocus() || this.isHover()) return;
      this.#card.hidePopover();
    }, 50);
  }

  update() {
    if (!this.#card || !this.#open) {
      return;
    }
    const { innerHeight, innerWidth } = globalThis;
    const card_height = Number.parseFloat(
      this.#card.clientHeight,
    );
    const card_width = Number.parseFloat(
      this.#card.clientWidth,
    );
    const rect = this.#anchor.getBoundingClientRect();
    const anchor_start = rect.top;
    const anchor_end = innerHeight - rect.bottom;
    let anchor_left = this.#placer.getBoundingClientRect().left;
    let anchor_right = innerWidth - rect.right;
    const anchor_width = innerWidth - (anchor_left + anchor_right);
    const anchor_height = rect.height;
    // Swap in RTL writing mode
    const { direction } = globalThis.getComputedStyle(document.documentElement);
    if (direction === "rtl") {
      [anchor_left, anchor_right] = [anchor_right, anchor_left];
    }
    // Prefer placement above the anchor
    if (anchor_start < (card_height + 40) && anchor_end > anchor_start) {
      this.#card.style.removeProperty("--block-end");
      this.#card.style.setProperty(
        "--block-start",
        Math.round(anchor_start + anchor_height),
      );
      this.dataset.block = "end";
    } else {
      this.#card.style.removeProperty("--block-start");
      this.#card.style.setProperty(
        "--block-end",
        Math.round(anchor_end + anchor_height),
      );
      this.dataset.block = "start";
    }
    // Inline placement
    let start = anchor_left + (anchor_width / 2);
    start -= card_width / 2;
    start = Math.round(start);
    // Snap to left side of viewport
    let offset = Math.max(0, 0 - start);
    if (start < 0) start += 20;
    // Snap to right side of viewport
    if ((start - offset) + card_width > innerWidth) {
      offset += innerWidth -
        ((start - offset) + card_width) - 20;
    }
    this.#card.style.setProperty("--inline-offset", offset);
    this.#card.style.setProperty("--inline-start", start);
  }
  #template = `
<div role="tooltip" popover>
<button class="Button" type="button" popovertargetaction="hide">
  <span class="Hidden">hide tooltip</span>
  <svg role="presentation" viewBox="0 0 16 16">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
  </svg>
</button>
<h2></h2>
</div>
  `;

  async load() {
    if (this.#data !== undefined) return;
    this.#data = true;
    const response = await fetch(`/glossary/${this.#term}.json`);
    if (!response.ok || !response.body) {
      return;
    }
    try {
      const data = await response.text();
      this.#data = JSON.parse(data);
      const id = `--term-${this.#term}-popover`;
      const template = document.createElement("template");
      template.innerHTML = this.#template;
      const card = template.content.querySelector("div");
      card.id = id;
      const heading = card.querySelector("h2");
      heading.textContent = this.#data.title;
      heading.id = id.replace(/-popover$/, "-heading");
      card.setAttribute("aria-labelledby", heading.id);
      const tmp = document.createElement("template");
      tmp.innerHTML = this.#data.description;
      card.append(tmp.content);
      card.querySelector("button").setAttribute("popovertarget", id);
      if (this.#data.links.length) {
        const links = document.createElement("p");
        let html = `<h3><span class="Hidden">Sources</span></h3>`;
        for (const link of this.#data.links) {
          html += `<a href="${link.url}"`;
          if ("title" in link) {
            html += ` title="${link.title}"`;
          }
          if (!link.url.startsWith("/")) {
            html += ` rel="noopener noreferrer" target="_blank"`;
          }
          html += `>${link.name}</a>`;
        }
        links.innerHTML = html;
        card.append(links);
      }
      card.addEventListener("beforetoggle", (ev) => {
        this.#beforeToggle(ev);
      });
      this.#card = card;
      this.append(card);
      this.#placer = document.createElement("span");
      this.prepend(this.#placer);
      this.#ready.resolve(true);
    } catch (err) {
      console.error(err);
      // Give up...
      this.#data = null;
      this.#ready.resolve(false);
    }
  }
}

globalThis.customElements.define("glossary-term", Component);
