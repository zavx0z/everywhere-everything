import styles from "./styles.js"
import { i18n } from "./utils.js"
const html = String.raw
export default class Node extends HTMLElement {
  /** @type {ShadowRoot} */ #host
  preview = true
  constructor() {
    super()
    this.#host = this.attachShadow({ mode: "closed" })
    this.#host.innerHTML = html`
      <style>
        ${styles}
      </style>
    `
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
          <div>
            ${Object.entries(schema.input)
              .map(([key, value]) => {
                switch (value.type) {
                  case "string":
                    return html`<input-file-device label="${i18n(value.title)}" key="${key}" />`
                }
              })
              .join("")}
          </div>
          <div>
            ${Object.entries(schema.output)
              .map(([key, value]) => {
                switch (value.type) {
                  case "string":
                    return html`<output-string label="${i18n(value.title)}" />`
                }
              })
              .join("")}
          </div>
        </div>
      </div>
    `
    this.#host.appendChild(template.content)
    import("./output/String.js")
    import("./input/file-device/component.js")

    if (schema.preview) {
      const button = this.#host.querySelector("button-preview")
      import("./components/ButtonPreview.js")
      button.onclick = ({ currentTarget }) => console.log(currentTarget.preview)
    }
  }
}
