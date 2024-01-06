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
  connectedCallback() {}
}
customElements.define("preview-window", Preview)
