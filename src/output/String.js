import "../port/OutputPort.js"

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
`
class OutputString extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = /*html*/ `
      <style> ${styles} </style>
      <div class="param">
        <output-port></output-port>
        <p class="no-select">${this.label}</p>
      </div>
    `
  }
  connectedCallback() {}
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
