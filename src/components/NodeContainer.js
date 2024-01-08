const css = String.raw
const html = String.raw
const styles = css`
  :host {
    position: absolute;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-template-rows: 2rem max-content;
    border-radius: var(--node-border-radius);
    background-color: var(--surface-700);
    box-shadow: 0px 3px 5px 4px rgba(15, 23, 42, 0.8);
    z-index: 4;
  }
`
class Node extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.shadowRoot.innerHTML = html`
      <style>
        ${styles}
      </style>
      <slot></slot>
    `
  }
  connectedCallback() {}
  static get observedAttributes() {
    return ["left", "top", "width"]
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue)
      switch (name) {
        case "left":
          this.shadowRoot.host.style.left = newValue + "px"
          break
        case "top":
          this.shadowRoot.host.style.top = newValue + "px"
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
