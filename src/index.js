export default class Node extends HTMLElement {
  /** @type {ShadowRoot} */ #host
  schema
  constructor() {
    super()
    this.#host = this.attachShadow({ mode: "closed" })
    this.#host.innerHTML = /*html*/ `<p>Node</p>`
    console.log(this.#host.innerHTML)
  }
  async connectedCallback() {
    const schema = await fetch(this.getAttribute("schema")).then((data) => data.json())
    const { title, description, input, output } = schema
    console.log(title, description, input, output)
  }
}
