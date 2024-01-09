import { i18n } from "./utils.js"
import "./components/NodeContainer.js"
import "./components/NodeBody.js"
import "./components/NodeHeader.js"
import "./elements/ButtonSettings.js"

const html = String.raw
class Node extends HTMLElement {
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
    const imports = []
    this.style.setProperty("--x", this.#state.position.x)
    this.style.setProperty("--y", this.#state.position.y)
    this.style.setProperty("--width", this.#state.size.width)

    const innerHTML = html`
      <div class="preview"></div>
      <div class="header">
        <h1 class="no-select">${i18n(schema.title)}</h1>
        <form onsubmit="return false">
          <button
            name="preview-toggle"
            value=${this.#state.preview ? "hidden" : "visible"}
            onclick="this.value = this.value === 'hidden' ? 'visible' : 'hidden'"></button>
        </form>
      </div>
      <node-body>
        <div>
          ${Object.entries(schema.input)
            .map(([key, value]) => {
              switch (value.type) {
                case "string":
                  imports.push("./input/FileDevice.js")
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
                  imports.push("./output/String.js")
                  return html` <output-string label="${i18n(value.title)}"></output-string> `
              }
            })
            .join("")}
        </div>
      </node-body>
    `
    const host = this
    await Promise.all(imports.map((js) => import(js)))
    this.innerHTML += innerHTML

    this.querySelector("form").addEventListener("submit", (event) => {
      console.log(event)
    })

    this.#node = host.querySelector("node-container")
    this.#header = host.querySelector(".header")
    this.#header.addEventListener("move", this.#handleMove)
    this.addEventListener("change", (event) => {
      console.log(event.target)
    })
    this.addEventListener("touchstart", (event) => {
      if (event.touches.length === 1) {
        // event.preventDefault()
        const target = event.touches[0]
        let initialX = target.clientX
        let initialY = target.clientY

        const moveElement = (event) => {
          const target = event.touches[0]
          let currentX = target.clientX
          let currentY = target.clientY
          let deltaX = currentX - initialX
          let deltaY = currentY - initialY
          this.style.setProperty("--x", +this.style.getPropertyValue("--x") + deltaX)
          this.style.setProperty("--y", +this.style.getPropertyValue("--y") + deltaY)
          initialX = currentX
          initialY = currentY
        }
        function stopElement(event) {
          document.removeEventListener("touchmove", moveElement)
          document.removeEventListener("touchend", stopElement)
        }
        document.addEventListener("touchmove", moveElement)
        document.addEventListener("touchend", stopElement)
      }
    })
    this.addEventListener("mousedown", (event) => {
      let initialX = event.clientX
      let initialY = event.clientY
      const moveElement = (event) => {
        let currentX = event.clientX
        let currentY = event.clientY
        let deltaX = currentX - initialX
        let deltaY = currentY - initialY
        this.style.setProperty("--x", +this.style.getPropertyValue("--x") + deltaX)
        this.style.setProperty("--y", +this.style.getPropertyValue("--y") + deltaY)
        // this.dispatchEvent(new CustomEvent("move", { detail: { x: deltaX, y: deltaY } }))
        initialX = currentX
        initialY = currentY
      }
      function stopElement(event) {
        document.removeEventListener("mousemove", moveElement)
        document.removeEventListener("mouseup", stopElement)
      }
      document.addEventListener("mousemove", moveElement)
      document.addEventListener("mouseup", stopElement)
    })
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
customElements.define("node-component", Node)
