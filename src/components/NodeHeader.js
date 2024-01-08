const css = String.raw
const html = String.raw
const styles = css`
  :host {
    position: relative;
    display: grid;
    grid-template-columns: max-content max-content;
    grid-template-rows: 1fr;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--node-border-radius) var(--node-border-radius) 0 0;
    padding: 0 0.5rem;
    background-color: var(--secondary-900);
  }
  ::slotted(h1) {
    display: inline;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: 0px;
    color: white;
    filter: var(--drop-shadow-lg);
    margin: 0;
  }
`
class NodeHeader extends HTMLElement {
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
  static get observedAttributes() {
    return []
  }
  attributeChangedCallback(name, oldValue, newValue) {}
  connectedCallback() {
    this.addEventListener("touchstart", (event) => {
      if (event.touches.length === 1) {
        event.preventDefault()
        const target = event.touches[0]
        let initialX = target.clientX
        let initialY = target.clientY

        const moveElement = (event) => {
          const target = event.touches[0]
          let currentX = target.clientX
          let currentY = target.clientY
          let deltaX = currentX - initialX
          let deltaY = currentY - initialY
          this.dispatchEvent(new CustomEvent("move", { detail: { x: deltaX, y: deltaY } }))
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
        this.dispatchEvent(new CustomEvent("move", { detail: { x: deltaX, y: deltaY } }))
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
}
customElements.define("node-header", NodeHeader)
