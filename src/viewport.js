import { applyPatch } from "https://cdn.jsdelivr.net/npm/fast-json-patch@3.1.1/+esm"
class Position {
  #style
  constructor(style) {
    this.#style = style
  }
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
  get z() {
    return parseFloat(this.#style.getPropertyValue("--z"))
  }
  set z(value) {
    this.#style.setProperty("--z", value)
  }
}
class Size {
  #style
  constructor(style) {
    this.#style = style
  }
  get width() {
    return parseFloat(this.#style.getPropertyValue("--width"))
  }
  set width(value) {
    this.#style.setProperty("--width", value)
  }
  get height() {
    return parseFloat(this.#style.getPropertyValue("--height"))
  }
  set height(value) {
    this.#style.setProperty("--height", value)
  }
}

class State {
  constructor(style) {
    this.position = new Position(style)
    this.size = new Size(style)

    this.position.x = 0
    this.position.y = 0
    this.position.z = 0
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
}

class Viewport extends HTMLElement {
  #state
  constructor() {
    super()

    document.body.addEventListener("mousedown", this.handleMoveMouse)
    document.addEventListener("touchstart", this.handleMoveMouse)
    this.#state = new State(this.style)
  }
  connectedCallback() {}
  handleMoveMouse = (event) => {
    console.log(event)
  }
  handleMoveMouse = (event) => {
    console.log(event)
    event.stopPropagation()
    let initialX = event.clientX
    let initialY = event.clientY
    const moveElement = (event) => {
      this.#state.updatePosition(event.clientX - initialX, event.clientY - initialY)
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
    event.preventDefault()
    event.stopPropagation()
    if (event.touches.length === 1) {
      event.preventDefault()
      event.stopPropagation()
      let initialX = event.touches[0].clientX
      let initialY = event.touches[0].clientY
      const moveElement = (event) => {
        this.#state.updatePosition(event.touches[0].clientX - initialX, event.touches[0].clientY - initialY)
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
customElements.define("metafor-viewport", Viewport)
