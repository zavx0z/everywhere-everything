import styles from "./styles.js"
import { i18n } from "./utils.js"
const html = String.raw
export default class Node extends HTMLElement {
  /** @type {ShadowRoot} */ #host
  preview = false
  constructor() {
    super()
    this.#host = this.attachShadow({ mode: "closed" })
    this.#host.innerHTML = html`
      <style>
        ${styles}
      </style>
    `
  }
  async connectedCallback() {
    const schema = await fetch(this.getAttribute("schema")).then((data) => data.json())
    const template = document.createElement("template")
    template.innerHTML = html`
      <div class="node">
        <preview-window preview=${this.preview}> </preview-window>
        <div class="header">
          <h1>${i18n(schema.title)}</h1>
          <preview-button preview=${this.preview}></preview-button>
        </div>
        <div class="node-body">
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
        </div>
      </div>
    `
    await this.#import(schema)
    this.#host.appendChild(template.content)
    if (schema.preview) this.#handlerTogglePreview()
  }
  async #import(schema) {
    const imports = []
    imports.push("./output/String.js")
    imports.push("./input/file-device/component.js")
    if (schema.preview) {
      imports.push("./components/preview/Button.js")
      imports.push("./components/preview/Window.js")
    }
    await Promise.all(imports.map((js) => import(js)))
  }
  #handlerTogglePreview() {
    const button = this.#host.querySelector("preview-button")
    const previewWindow = this.#host.querySelector("preview-window")
    button.onclick = ({ currentTarget }) => {
      this.preview = currentTarget.preview
      previewWindow.preview = currentTarget.preview
    }
  }
}
