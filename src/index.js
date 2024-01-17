import { applyPatch } from "https://cdn.jsdelivr.net/npm/fast-json-patch@3.1.1/+esm"

export default class Atom {
  onupdate = () => {}
  update = (patch) => {
    if (this.node) applyPatch(this.node.state, patch)
  }
  constructor({ id, state, schema }) {
    this.id = id
    this.schema = schema
    const node = new Node(schema, state)
    node.state.onupdate = (patch) => {
      this.onupdate(patch)
    }
    document.body.querySelector("metafor-viewport").appendChild(node)
    this.node = node
  }
}
class Position {
  #style
  get x() {
    return parseFloat(this.#style.getPropertyValue("--x"))
  }
  set x(value) {
    this.#style.setProperty("--x", value)
  }
  get y() {
    return parseFloat(this.#style.getPropertyValue("--y"))
  }
  set y(value) {
    this.#style.setProperty("--y", value)
  }
  constructor(style) {
    this.#style = style
  }
}
class Size {
  #style
  get width() {
    return parseFloat(this.#style.getPropertyValue("--width"))
  }
  set width(value) {
    this.#style.setProperty("--width", value)
  }
  constructor(style) {
    this.#style = style
  }
}
class State {
  #buttonPreview
  constructor(element, state) {
    this.#buttonPreview = element.querySelector("button[name='preview']")
    this.position = new Position(element.style)
    this.size = new Size(element.style)

    this.size.width = state.size.width
    this.position.x = state.position.x
    this.position.y = state.position.y
    this.preview = state.preview

    element.style.setProperty("--minWidth", 350)
    element.style.opacity = 1
  }
  get preview() {
    return this.#buttonPreview.value === "visible"
  }
  set preview(value) {
    this.#buttonPreview.value = value ? "visible" : "hidden"
  }
  onupdate = (patch) => console.log("implement onupdate")
  #onupdate = (patch) => {
    if (patch.length) {
      applyPatch(this, patch)
      this.onupdate(patch)
    }
  }
  updatePosition = (deltaX, deltaY) => {
    let patch = []
    if (deltaX !== 0) patch.push({ op: "replace", path: "/position/x", value: this.position.x + deltaX })
    if (deltaY !== 0) patch.push({ op: "replace", path: "/position/y", value: this.position.y + deltaY })
    this.#onupdate(patch)
  }
  updateWidth = (side, deltaX, minWidth) => {
    if (deltaX !== 0) {
      const width = side === "left" ? this.size.width - deltaX : this.size.width + deltaX
      if (width > minWidth) {
        this.#onupdate([
          { op: "replace", path: "/position/x", value: this.position.x + deltaX / 2 },
          { op: "replace", path: "/size/width", value: width },
        ])
      }
    }
  }
  togglePreview = () => this.#onupdate([{ op: "replace", path: "/preview", value: !this.preview }])
}
function i18n(param) {
  if (param && typeof param === "object") {
    const current = document.documentElement.lang
    const exist = Object.keys(param)
    return exist.includes(current) ? param[current] : exist.includes("en") ? param["en"] : param[exist[0]]
  } else return param
}
const html = String.raw
class Node extends HTMLElement {
  constructor(schema, state) {
    super()
    const { title, input, output } = schema
    this.innerHTML = html`
      <div class="header">
        <div class="preview no-select" onmousedown="event.stopPropagation()" ontouchstart="event.stopPropagation()">
          <div></div>
        </div>
        <h1 class="no-select">${i18n(title)}</h1>
        <form name="header-panel" onmousedown="event.stopPropagation()" ontouchstart="event.stopPropagation()">
          <button name="preview" value="hidden"></button>
        </form>
      </div>
      <div class="body">
        <form name="input" enctype="multipart/form-data">
          ${Object.entries(input)
            .map(([key, value]) => {
              const title = i18n(value.title)
              switch (value.type) {
                case "file":
                  return html`
                    <div>
                      <div class="port"></div>
                      <input type="file" placeholder="${title}" name="${key}" />
                      <div class="resize"></div>
                    </div>
                  `
              }
            })
            .join("")}
        </form>
        <form name="output" enctype="multipart/form-data">
          ${Object.entries(output)
            .map(([key, value]) => {
              const title = i18n(value.title)
              switch (value.type) {
                case "string":
                  return html`
                    <div>
                      <div class="resize"></div>
                      <p>${title}</p>
                      <div class="port" data-key="${key}"></div>
                    </div>
                  `
              }
            })
            .join("")}
        </form>
      </div>
    `
    this.state = new State(this, state)
  }
  connectedCallback() {
    this.querySelector("form[name='header-panel']").addEventListener("submit", this.handleFormHeader)
    this.querySelector(".header").addEventListener("touchstart", this.handleMoveTouch)
    this.querySelector(".header").addEventListener("mousedown", this.handleMoveMouse)
    this.querySelector(".body").addEventListener("touchstart", this.handleResizeTouch)
    this.querySelector(".body").addEventListener("mousedown", this.handleResizeMouse)
    this.querySelector("form[name='input']").addEventListener("change", this.handleFormInput)
    this.querySelector("form[name='output']").addEventListener("change", this.handleFormOutput)
  }
  disconnectedCallback() {
    this.querySelector("form[name='header-panel']").removeEventListener("submit", this.handleFormHeader)
    this.querySelector(".header").removeEventListener("touchstart", this.handleMoveTouch)
    this.querySelector(".header").removeEventListener("mousedown", this.handleMoveMouse)
    this.querySelector(".body").removeEventListener("touchstart", this.handleResizeTouch)
    this.querySelector(".body").removeEventListener("mousedown", this.handleResizeMouse)
    this.querySelector("form[name='input']").removeEventListener("change", this.handleFormInput)
    this.querySelector("form[name='output']").removeEventListener("change", this.handleFormOutput)
  }
  handleFormInput = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const data = new FormData(event.currentTarget)
    const input = {}
    for (let [key, value] of data) input[key] = value
    // this.onupdate({ input })
  }
  handleFormOutput = (event) => {
    event.preventDefault()
    event.stopPropagation()
    console.log(event)
  }
  handleFormHeader = (event) => {
    event.preventDefault()
    event.stopPropagation()
    switch (event.submitter.name) {
      case "preview":
        this.state.togglePreview()
    }
  }
  handleResizeMouse = (event) => {
    if (event.target.className === "resize") {
      event.preventDefault()
      event.stopPropagation()
      event.target.style.setProperty("--opacity", 1)
      document.body.style.cursor = "col-resize"
      let initialX = event.clientX
      const side = event.target.parentElement.parentElement.name === "input" ? "right" : "left"
      const minWidth = +getComputedStyle(this).getPropertyValue("--minWidth")
      const moveElement = (event) => {
        this.state.updateWidth(side, event.clientX - initialX, minWidth)
        initialX = event.clientX
      }
      function stopElement() {
        document.removeEventListener("mousemove", moveElement)
        document.removeEventListener("mouseup", stopElement)
        event.target.style.setProperty("--opacity", 0)
        document.body.style.cursor = "default"
        // event.target.removeEventListener("mouseleave", stopElement)
      }
      document.addEventListener("mousemove", moveElement)
      document.addEventListener("mouseup", stopElement)
      // event.target.addEventListener("mouseleave", stopElement)
    }
  }
  handleResizeTouch = (event) => {
    if (event.touches[0].target.className === "resize") {
      event.preventDefault()
      event.stopPropagation()
      event.touches[0].target.style.setProperty("--opacity", 1)
      let initialX = event.touches[0].clientX
      const side = event.touches[0].target.parentElement.parentElement.name === "input" ? "right" : "left"
      const minWidth = +getComputedStyle(this).getPropertyValue("--minWidth")
      const moveElement = (event) => {
        this.state.updateWidth(side, event.touches[0].clientX - initialX, minWidth)
        initialX = event.touches[0].clientX
      }
      function stopElement() {
        document.removeEventListener("touchmove", moveElement)
        document.removeEventListener("touchend", stopElement)
        event.touches[0].target.style.setProperty("--opacity", 0)
      }
      document.addEventListener("touchmove", moveElement)
      document.addEventListener("touchend", stopElement)
    }
  }
  handleMoveMouse = (event) => {
    event.stopPropagation()
    let initialX = event.clientX
    let initialY = event.clientY
    const moveElement = (event) => {
      this.state.updatePosition(event.clientX - initialX, event.clientY - initialY)
      initialX = event.clientX
      initialY = event.clientY
    }
    function stopElement() {
      document.removeEventListener("mousemove", moveElement)
      document.removeEventListener("mouseup", stopElement)
    }
    document.addEventListener("mousemove", moveElement)
    document.addEventListener("mouseup", stopElement)
  }
  handleMoveTouch = (event) => {
    if (event.touches.length === 1) {
      event.preventDefault()
      event.stopPropagation()
      let initialX = event.touches[0].clientX
      let initialY = event.touches[0].clientY
      const moveElement = (event) => {
        this.state.updatePosition(event.touches[0].clientX - initialX, event.touches[0].clientY - initialY)
        initialX = event.touches[0].clientX
        initialY = event.touches[0].clientY
      }
      function stopElement() {
        document.removeEventListener("touchmove", moveElement)
        document.removeEventListener("touchend", stopElement)
      }
      document.addEventListener("touchmove", moveElement)
      document.addEventListener("touchend", stopElement)
    }
  }
}
customElements.define("metafor-node", Node)
