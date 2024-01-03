export default class SocketString extends HTMLElement {
  /* @type {ShadowRoot} */ #host
  constructor() {
    super()
    this.#host = this.attachShadow({ mode: "open" })
  }
  connectedCallback() {
    const name = this.getAttribute("name")
    const title = this.getAttribute("title")
    const value = this.getAttribute("value")
    this.#host.innerHTML = /*html*/ `
        <label for="${name}">
          ${title}
        </label>
        <input
          type="text"
          name="${name}"
          value="${value}"
        />
      `
  }
  static get observedAttributes() {
    return ["title", "value"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "title" && oldValue !== null && newValue !== oldValue) {
      const label = this.querySelector("label")
      if (label) label.textContent = newValue
    }
    if (name === "value" && oldValue !== null && newValue !== oldValue) {
      const input = this.querySelector("input")
      if (input) input.value = newValue
    }
  }
}
