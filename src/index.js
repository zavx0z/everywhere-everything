import Params from "./components/Params.js"
import { i18n } from "./utils.js"
const html = String.raw
export default class Node extends HTMLElement {
  /** @type {ShadowRoot} */ #host
  preview = true
  constructor() {
    super()
    this.#host = this.attachShadow({ mode: "closed" })
    this.#host.innerHTML = html` <link rel="stylesheet" href="src/styles.css" type="text/css" /> `
  }
  //   <p class="description">
  //   ${i18n(schema.description)}
  // </p>
  async connectedCallback() {
    const schema = await fetch(this.getAttribute("schema")).then((data) => data.json())
    const template = document.createElement("template")
    template.innerHTML = html`
      <div class="node">
        <div class="header">
          <h1>${i18n(schema.title)}</h1>
          <button-preview preview=${this.preview} />
        </div>
        <div class="node-body">
          <div>${Params(schema.input, "input")}</div>
          <div>${Params(schema.output, "output")}</div>
        </div>
      </div>
    `
    this.#host.appendChild(template.content)

    if (schema.preview) {
      const button = this.#host.querySelector("button-preview")
      import("./components/ButtonPreview.js")
      button.onclick = ({ currentTarget }) => console.log(currentTarget.preview)
    }
  }
}
