const html = String.raw
import styles from "./styles.js"
class FileDevice extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = /*html*/ ` <style> ${styles} </style> `
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
    const key = this.getAttribute("key")
    this.innerHTML += html`
      <div class="param">
        <div class="port"></div>
        <label class="no-select" for="${key}"> ${this.label} </label>
        <input type="text" name="${key}" />
        <button>
          <svg version="1.1" viewBox="363 75 14 13" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M363.5 75C363.224 75 363 75.2239 363 75.5L363 79L377 79L377 77.5C377 77.2239 376.776 77 376.5 77L368 77L368 75.5C368 75.2239 367.776 75 367.5 75L363.5 75Z" />
            <path
              d="M363.5 80C363.224 80 363 80.2239 363 80.5L363 87.5C363 87.7761 363.224 88 363.5 88L376.5 88C376.776 88 377 87.7761 377 87.5L377 80.5C377 80.2239 376.776 80 376.5 80L363.5 80Z" />
          </svg>
        </button>
      </div>
    `
  }
}
customElements.define("input-file-device", FileDevice)
