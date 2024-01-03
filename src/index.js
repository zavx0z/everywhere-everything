import Params from "./components/Params.js"
import { i18n } from "./utils.js"

export default class Node extends HTMLElement {
  /** @type {ShadowRoot} */ #host
  constructor() {
    super()
    this.#host = this.attachShadow({ mode: "closed" })
  }
  async connectedCallback() {
    const schema = await fetch(this.getAttribute("schema")).then((data) => data.json())
    this.#host.innerHTML = /*html*/ `
    <link rel="stylesheet" href="src/styles.css" type="text/css">
    <div class="node">
      <div class="node-title">
        <h1 class="node-title-text">
          ${i18n(schema.title)} 
        </h1>
        <p class="node-description">
          ${i18n(schema.description)}
        </p>
      </div>
      <div class="node-body">
        <div class="node-body-sockets">
          ${Params(schema.input, "input")}
        </div>
        <div class="node-body-sockets">
          ${Params(schema.output, "output")}
        </div>
      </div>
    </div>
  `
  }
}
