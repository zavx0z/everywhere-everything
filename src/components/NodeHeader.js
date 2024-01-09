class NodeHeader extends HTMLElement {
  constructor() {
    super()
  }
  connectedCallback() {
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
