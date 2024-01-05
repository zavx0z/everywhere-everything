const html = String.raw
const css = String.raw
const styles = css`
  .param {
    position: relative;
  }
  p {
    display: block;
    margin: 0;
    text-align: right;
  }
  .port {
    position: absolute;
    height: 0.75rem;
    width: 0.75rem;
    border-radius: 9999px;
    background-color: rgb(14 165 223);
    outline-style: solid;
    outline-width: 1px;
    outline-color: #020617;
    right: -1.125rem;
    top: 0.5rem;
  }
`
class OutputString extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = /*html*/ `<style> ${styles} </style>`
  }
  connectedCallback() {
    this.shadowRoot.innerHTML += html`
      <div class="param">
        <div class="port"></div>
        <p class="no-select">${this.label}</p>
      </div>
    `
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
}
customElements.define("output-string", OutputString)
