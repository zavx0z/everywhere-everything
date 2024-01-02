import { ComponentNode } from "./components/Node.js"
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
    const title = i18n(schema.title)
    const description = i18n(schema.description)
    const input = Params(schema.input)
    const output = Params(schema.output)
    this.#host.innerHTML = ComponentNode(title, description, input, output)
  }
}
