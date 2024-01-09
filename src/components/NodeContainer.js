class Node extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = /*html*/ ` <slot></slot> `
  }
  connectedCallback() {}
  static get observedAttributes() {
    return ["left", "top", "width"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue)
      switch (name) {
        case "left":
          this.shadowRoot.host.style.setProperty("--x", newValue)
          break
        case "top":
          this.shadowRoot.host.style.setProperty("--y", newValue)
          break
        case "width":
          this.shadowRoot.host.style.width = newValue + "px"
      }
  }
  get width() {
    return +this.getAttribute("width")
  }
  set width(value) {
    this.setAttribute("width", value)
  }
  get left() {
    return +this.getAttribute("left")
  }
  set left(value) {
    this.setAttribute("left", value)
  }
  get top() {
    return +this.getAttribute("top")
  }
  set top(value) {
    this.setAttribute("top", value)
  }
}
customElements.define("node-container", Node)
