import styles from "./styles.js"
const html = String.raw

class Preview extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = html`
      <style>
        ${styles}
      </style>
      <div class="preview-content"></div>
      <div class="blur"></div>
    `
  }
  connectedCallback() {}
}
customElements.define("preview-window", Preview)
