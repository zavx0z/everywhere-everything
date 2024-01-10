import { i18n } from "./utils.js"
import "./output/String.js"
import "./input/FileDevice.js"

const html = String.raw
class Node extends HTMLElement {
  constructor() {
    super()
  }
  async connectedCallback() {
    const schema = await fetch(this.getAttribute("schema")).then((data) => data.json())
    const snapshot = localStorage.getItem(this.getAttribute("id"))
    let previewVisible = false
    if (snapshot) {
      const state = JSON.parse(snapshot)
      previewVisible = state.preview
      this.style.left = state.position.x + "px"
      this.style.top = state.position.y + "px"
    }
    this.innerHTML = html`
      <div class="preview"></div>
      <div class="header">
        <h1 class="no-select">${i18n(schema.title)}</h1>
        <form onmousedown="event.stopPropagation()" ontouchstart="event.stopPropagation()">
          <button name="preview-toggle" value=${previewVisible ? "visible" : "hidden"}></button>
        </form>
      </div>
      <div class="body">
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
    `
    this.querySelector("form").addEventListener("submit", this.handleHeaderForm)
    this.querySelector(".header").addEventListener("touchstart", this.handleMoveTouch)
    this.querySelector(".header").addEventListener("mousedown", this.handleMoveMouse)
  }
  disconnectedCallback() {
    this.querySelector("form").removeEventListener("submit", this.handleHeaderForm)
    this.querySelector(".header").removeEventListener("touchstart", this.handleMoveTouch)
    this.querySelector(".header").removeEventListener("mousedown", this.handleMoveMouse)
  }
  positionUpdate = (deltaX, deltaY) => {
    if (deltaX !== 0) this.style.left = this.offsetLeft + deltaX + "px"
    if (deltaY !== 0) this.style.top = this.offsetTop + deltaY + "px"
  }
  widthUpdate = () => {}
  previewUpdate = (element) => {
    element.value = element.value === "visible" ? "hidden" : "visible"
  }
  handleHeaderForm = (event) => {
    event.preventDefault()
    event.stopPropagation()
    switch (event.submitter.name) {
      case "preview-toggle":
        this.previewUpdate(event.submitter)
    }
  }
  handleMoveMouse = (event) => {
    event.stopPropagation()
    let initialX = event.clientX
    let initialY = event.clientY
    const moveElement = (event) => {
      this.positionUpdate(event.clientX - initialX, event.clientY - initialY)
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
      event.stopPropagation()
      let initialX = event.touches[0].clientX
      let initialY = event.touches[0].clientY
      const moveElement = (event) => {
        this.positionUpdate(event.touches[0].clientX - initialX, event.touches[0].clientY - initialY)
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
customElements.define("node-component", Node)
