import Params from "./components/Params.js"
import { i18n } from "./utils.js"

export default class Node extends HTMLElement {
  /** @type {ShadowRoot} */ #host
  constructor() {
    super()
    this.#host = this.attachShadow({ mode: "closed" })
    this.#host.innerHTML = /*html*/ `
    <link rel="stylesheet" href="src/styles.css" type="text/css">
    `
  }
  async connectedCallback() {
    const schema = await fetch(this.getAttribute("schema")).then((data) => data.json())
    const template = document.createElement("template")
    template.innerHTML = /*html*/ `
    <div class="node">
      <div class="node-title">
        <h1 class="no-select">
          ${i18n(schema.title)} 
        </h1>
        <p class="description">
          ${i18n(schema.description)}
        </p>
      </div>
      <div class="node-body">
        <div>
          ${Params(schema.input, "input")}
        </div>
        <div>
          ${Params(schema.output, "output")}
        </div>
      </div>
    </div>
    `
    this.#host.appendChild(template.content)
  }
}
