const html = String.raw
const css = String.raw
class OutputString extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }
  static get observedAttributes() {
    return ["label"]
  }
  get label() {
    return this.getAttribute("label")
  }
  set label(val) {
    this.setAttribute("label", val)
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = /*html*/ `
      <link rel="stylesheet" href="/src/output/string/styles.css">
      <div class="param">
        <div class="port"></div>
        <p class="no-select">${this.label}</p>
      </div>
    `
  }
}
customElements.define("output-string", OutputString)
