import styles from "./styles.js"
const html = String.raw
class Node extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = html`
      <style>
        ${styles}
      </style>
      <slot></slot>
    `
  }
  connectedCallback() {
    this.addEventListener("click", (event) => {
      console.log(event.currentTarget)
    })
  }
}
customElements.define("node-container", Node)
