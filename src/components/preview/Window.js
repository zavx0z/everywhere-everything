import styles from "./styles.js"
const html = String.raw

class Preview extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = html`
      <style>
        ${styles}
      </style>
      <div class="blur"></div>
      <div class="preview-content"></div>
    `
  }
  static get observedAttributes() {
    return ["preview"]
  }
  attributeChangedCallback() {
    this.style.opacity = this.preview ? "1" : "0"
  }
  get preview() {
    return this.getAttribute("preview") === "true"
  }
  set preview(value) {
    this.setAttribute("preview", value)
  }
}
customElements.define("preview-window", Preview)
