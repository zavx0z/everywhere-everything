class Viewport extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
    this.addEventListener("mousedown", this.handleMoveMouse)
  }
  handleMoveMouse = (event) => {
    console.log(event)
  }
}
customElements.define("metafor-viewport", Viewport)
