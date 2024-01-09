class NodeBody extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = /*html*/ ` <slot></slot> `
  }
  connectedCallback() {}
  static get observedAttributes() {
    return []
  }
  attributeChangedCallback(name, oldValue, newValue) {}
}
customElements.define("node-body", NodeBody)
