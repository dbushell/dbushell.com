export class Component extends HTMLElement {
  static observedAttributes = ['disabled'];
  #internals;
  #form: HTMLFormElement | null;

  constructor() {
    super();
    this.#internals = this.attachInternals();
    this.#form = null;
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    this.toggleAttribute('disabled', value);
  }

  get fields(): Array<HTMLElement> {
    if (!this.#form) return [];
    return Array.from(this.#form.querySelectorAll(':is(button, input, select, textarea)'));
  }

  get prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  connectedCallback(): void {
    this.#form = this.querySelector<HTMLFormElement>('form');
    this.#form?.addEventListener('submit', (ev) => this.#onSubmit(ev));
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'disabled') {
      const states = this.#internals.states as Set<string>;
      if (this.disabled) {
        states.add('disabled');
      } else {
        states.delete('disabled');
      }
      for (const element of this.fields) {
        element.toggleAttribute('disabled', this.disabled);
      }
    }
  }

  setNotice(success: boolean, value: string): void {
    const message = document.createElement('p');
    message.innerHTML = `<strong></strong>`;
    message.className = success ? 'Success' : 'Error';
    message.querySelector('strong')!.innerText = value;
    this.#form?.replaceWith(message);
    this.scrollIntoView({
      behavior: this.prefersReducedMotion ? 'instant' : 'smooth',
      block: 'start'
    });
  }

  async #onSubmit(ev: SubmitEvent): Promise<void> {
    if (!this.#form) return;
    ev.preventDefault();
    const formData = new FormData(this.#form);
    formData.set('whodis', '');
    this.disabled = true;
    try {
      const response = await fetch(this.#form.action, {
        method: 'POST',
        body: formData
      });
      const {status} = response;
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
      this.setNotice(false, 'Error sending your enquiry. Please use the email address above.');
      console.debug(err);
    }
  }
}

globalThis.customElements.define('contact-form', Component);
