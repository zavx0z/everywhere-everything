function i18n(param) {
  if (param && typeof param === "object") {
    const current = document.documentElement.lang
    const exist = Object.keys(param)
    return exist.includes(current) ? param[current] : exist.includes("en") ? param["en"] : param[exist[0]]
  } else return param
}
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
      <div class="header">
        <div class="preview"></div>
        <h1 class="no-select">${i18n(schema.title)}</h1>
        <form onmousedown="event.stopPropagation()" ontouchstart="event.stopPropagation()">
          <button name="preview" value=${previewVisible ? "visible" : "hidden"}></button>
          <button name="settings"></button>
        </form>
      </div>
      <div class="body">
        ${Object.entries(schema.input)
          .map(([key, value]) => {
            const title = i18n(value.title)
            switch (value.type) {
              case "string":
                return html`
                  <div class="input">
                    <div class="port"></div>
                    <div class="file-device">
                      <input type="text" disabled name="${key}" placeholder="${title}" />
                      <button name="open-file" title="open"></button>
                    </div>
                    <div class="resize"></div>
                  </div>
                `
            }
          })
          .join("")}
        ${Object.entries(schema.output)
          .map(([key, value]) => {
            const title = i18n(value.title)
            switch (value.type) {
              case "string":
                return html`
                  <div class="output">
                    <div class="resize"></div>
                    <p class="no-select">${title}</p>
                    <div class="port"></div>
                  </div>
                `
            }
          })
          .join("")}
      </div>
    `
    this.style.opacity = 1
    this.querySelector("form").addEventListener("submit", this.handleHeaderForm)
    this.querySelector(".header").addEventListener("touchstart", this.handleMoveTouch)
    this.querySelector(".header").addEventListener("mousedown", this.handleMoveMouse)
    this.querySelector(".body").addEventListener("touchstart", this.handleResizeTouch)
    this.querySelector(".body").addEventListener("mousedown", this.handleResizeMouse)
  }
  disconnectedCallback() {
    this.querySelector("form").removeEventListener("submit", this.handleHeaderForm)
    this.querySelector(".header").removeEventListener("touchstart", this.handleMoveTouch)
    this.querySelector(".header").removeEventListener("mousedown", this.handleMoveMouse)
    this.querySelector(".body").removeEventListener("touchstart", this.handleResizeTouch)
    this.querySelector(".body").removeEventListener("mousedown", this.handleResizeMouse)
  }
  positionUpdate = (deltaX, deltaY) => {
    if (deltaX !== 0) this.style.left = this.offsetLeft + deltaX + "px"
    if (deltaY !== 0) this.style.top = this.offsetTop + deltaY + "px"
  }
  widthUpdate = (side, deltaX, minWidth) => {
    if (deltaX !== 0) {
      if (side === "left") {
        const width = this.offsetWidth - deltaX
        if (width > minWidth) {
          this.style.left = this.offsetLeft + deltaX + "px"
          this.style.width = width + "px"
        }
      } else if (side === "right") {
        const width = this.offsetWidth + deltaX
        if (width > minWidth) this.style.width = width + "px"
      }
    }
  }
  previewUpdate = (element) => {
    element.value = element.value === "visible" ? "hidden" : "visible"
  }
  handleHeaderForm = (event) => {
    event.preventDefault()
    event.stopPropagation()
    switch (event.submitter.name) {
      case "preview":
        this.previewUpdate(event.submitter)
    }
  }
  handleResizeMouse = (event) => {
    if (event.target.className === "resize") {
      event.preventDefault()
      event.stopPropagation()
      let initialX = event.clientX
      const side = event.target.parentElement.className === "input" ? "right" : "left"
      const minWidth = +getComputedStyle(this).getPropertyValue("--minWidth")
      const moveElement = (event) => {
        this.widthUpdate(side, event.clientX - initialX, minWidth)
        initialX = event.clientX
      }
      function stopElement() {
        document.removeEventListener("mousemove", moveElement)
        document.removeEventListener("mouseup", stopElement)
      }
      document.addEventListener("mousemove", moveElement)
      document.addEventListener("mouseup", stopElement)
    }
  }
  handleResizeTouch = (event) => {
    if (event.touches[0].target.className === "resize") {
      event.preventDefault()
      event.stopPropagation()
      let initialX = event.touches[0].clientX
      const side = event.touches[0].target.parentElement.className === "input" ? "right" : "left"
      const minWidth = +getComputedStyle(this).getPropertyValue("--minWidth")
      const moveElement = (event) => {
        this.widthUpdate(side, event.touches[0].clientX - initialX, minWidth)
        initialX = event.touches[0].clientX
      }
      function stopElement() {
        document.removeEventListener("touchmove", moveElement)
        document.removeEventListener("touchend", stopElement)
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
      event.preventDefault()
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
