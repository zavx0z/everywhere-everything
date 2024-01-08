import styles from "./styles.js"
import { i18n } from "./utils.js"
const html = String.raw
async function importComponents(schema) {
  const imports = [
    "./components/NodeContainer.js",
    "./components/NodeBody.js",
    "./components/NodeHeader.js",
    "./output/String.js",
    "./input/file-device/component.js",
  ]
  if (schema.preview) {
    imports.push("./components/preview/Button.js")
    imports.push("./components/preview/Window.js")
  }
  await Promise.all(imports.map((js) => import(js)))
}
export default class Node extends HTMLElement {
  /** @type {HTMLElement} */ #node
  /** @type {HTMLElement} */ #header
  /** @type {HTMLElement|undefined} */ #previewWindow
  /** @type {HTMLElement|undefined} */ #previewButton
  #state
  constructor() {
    super()
    const snapshot = localStorage.getItem(this.getAttribute("id"))
    this.#state = snapshot
      ? JSON.parse(snapshot)
      : {
          preview: false,
          size: {
            width: 400,
          },
          position: {
            x: 0,
            y: 0,
          },
        }
  }
  async connectedCallback() {
    const schema = await fetch(this.getAttribute("schema")).then((data) => data.json())
    await importComponents(schema)
    const host = this.attachShadow({ mode: "closed" })
    host.innerHTML = html`
      <style>
        ${styles}
      </style>
      <node-container top=${this.#state.position.y} left=${this.#state.position.x} width=${this.#state.size.width}>
        <preview-window preview=${this.#state.preview}> </preview-window>
        <node-header>
          <h1>${i18n(schema.title)}</h1>
          <preview-button preview=${this.#state.preview}></preview-button>
        </node-header>
        <node-body>
          <div>
            ${Object.entries(schema.input)
              .map(([key, value]) => {
                switch (value.type) {
                  case "string":
                    return html` <input-file-device label="${i18n(value.title)}" key="${key}"></input-file-device> `
                }
              })
              .join("")}
          </div>
          <div>
            ${Object.entries(schema.output)
              .map(([key, value]) => {
                switch (value.type) {
                  case "string":
                    return html` <output-string label="${i18n(value.title)}"></output-string> `
                }
              })
              .join("")}
          </div>
        </node-body>
      </node-container>
    `
    this.#node = host.querySelector("node-container")
    this.#header = host.querySelector("node-header")
    this.#header.addEventListener("move", this.#handleMove)
    if (schema.preview) {
      this.#previewWindow = host.querySelector("preview-window")
      this.#previewButton = host.querySelector("preview-button")
      this.#previewButton.addEventListener("togglePreview", this.#handlePreview)
    }
  }
  #handleMove = (event) => {
    this.#node.left += event.detail.x
    this.#node.top += event.detail.y
    this.#state.position = {
      x: this.#node.left,
      y: this.#node.top,
    }
    localStorage.setItem(this.getAttribute("id"), JSON.stringify(this.#state))
  }
  #handlePreview = (event) => {
    this.#state.preview = this.#previewWindow.preview = event.target.preview
    localStorage.setItem(this.getAttribute("id"), JSON.stringify(this.#state))
  }
  disconnectedCallback() {
    this.#header.removeEventListener("move", this.#handleMove)
    if (this.#previewButton) this.#previewButton.removeEventListener("togglePreview", this.#handlePreview)
  }
}
