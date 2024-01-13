function i18n(param) {
  if (param && typeof param === "object") {
    const current = document.documentElement.lang
    const exist = Object.keys(param)
    return exist.includes(current) ? param[current] : exist.includes("en") ? param["en"] : param[exist[0]]
  } else return param
}
const html = String.raw
class Node extends HTMLElement {
  get state() {}
  set state(value) {
    console.log("state", value)
    const x = value.position?.x
    if (x) this.style.left = x + "px"

    const y = value.position?.y
    if (y) this.style.top = y + "px"

    const width = value.size?.width
    if (width) this.style.width = width + "px"

    const preview = value.preview
    if (typeof preview === "boolean")
      this.querySelector("button[name='preview']").value = preview ? "visible" : "hidden"
  }
  append(element) {
    const preview = this.querySelector(".preview > div")
    preview.innerHTML = ""
    preview.append(element)
  }
  constructor() {
    super()
    this.preview = this.innerHTML
    this.channel = new BroadcastChannel(this.getAttribute("id"))
    this.style.setProperty("--minWidth", 350)
    this.style.width = this.getAttribute("width") + "px"
    this.style.left = this.getAttribute("x") + "px"
    this.style.top = this.getAttribute("y") + "px"
    const { title, input, output } = this.schema
    const previewVisible = this.getAttribute("preview") === "true"
    this.innerHTML = html`
      <div class="header">
        <div class="preview no-select" onmousedown="event.stopPropagation()" ontouchstart="event.stopPropagation()">
          <div>${this.preview}</div>
        </div>
        <h1 class="no-select">${i18n(title)}</h1>
        <form name="header-panel" onmousedown="event.stopPropagation()" ontouchstart="event.stopPropagation()">
          <button name="preview" value=${previewVisible ? "visible" : "hidden"}></button>
          <button name="settings"></button>
        </form>
      </div>
      <div class="body">
        <form name="input" enctype="multipart/form-data">
          ${Object.entries(input)
            .map(([key, value]) => {
              const title = i18n(value.title)
              switch (value.type) {
                case "string":
                  return html`
                    <div>
                      <div class="port"></div>
                      <input type="file" name="${key}" />
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
                      <p class="no-select">${title}</p>
                      <div class="port"></div>
                    </div>
                  `
              }
            })
            .join("")}
        </form>
      </div>
    `
    this.style.opacity = 1
  }
  connectedCallback() {
    this.querySelector("form[name='header-panel']").addEventListener("submit", this.handleFormHeader)
    this.querySelector(".header").addEventListener("touchstart", this.handleMoveTouch)
    this.querySelector(".header").addEventListener("mousedown", this.handleMoveMouse)
    this.querySelector(".body").addEventListener("touchstart", this.handleResizeTouch)
    this.querySelector(".body").addEventListener("mousedown", this.handleResizeMouse)
    this.querySelector("form[name='input']").addEventListener("change", this.handleFormInput)
    this.querySelector("form[name='output']").addEventListener("submit", this.handleFormOutput)
  }
  disconnectedCallback() {
    this.querySelector("form[name='header-panel']").removeEventListener("submit", this.handleFormHeader)
    this.querySelector(".header").removeEventListener("touchstart", this.handleMoveTouch)
    this.querySelector(".header").removeEventListener("mousedown", this.handleMoveMouse)
    this.querySelector(".body").removeEventListener("touchstart", this.handleResizeTouch)
    this.querySelector(".body").removeEventListener("mousedown", this.handleResizeMouse)
    this.querySelector("form[name='input']").removeEventListener("change", this.handleFormInput)
    this.querySelector("form[name='output']").removeEventListener("submit", this.handleFormOutput)
  }
  #subscribers = []
  subscribe(callback) {
    this.#subscribers.push(callback)
    return () => this.#subscribers.unshift(callback)
  }
  emit(data) {
    this.#subscribers.forEach((callback) => callback(data))
  }
  updatePosition = (deltaX, deltaY) => {
    if (deltaX !== 0 && deltaY !== 0) {
      const positionX = this.offsetLeft + deltaX
      const positionY = this.offsetTop + deltaY
      this.style.left = positionX + "px"
      this.style.top = positionY + "px"
      this.emit({ position: { x: positionX, y: positionY } })
    } else if (deltaX !== 0) {
      const positionX = this.offsetLeft + deltaX
      this.style.left = positionX + "px"
      this.emit({ position: { x: positionX } })
    } else if (deltaY !== 0) {
      const positionY = this.offsetTop + deltaY
      this.style.top = positionY + "px"
      this.emit({ position: { y: positionY } })
    }
  }
  updateWidth = (side, deltaX, minWidth) => {
    if (deltaX !== 0) {
      if (side === "left") {
        const width = this.offsetWidth - deltaX
        if (width > minWidth) {
          const positionX = this.offsetLeft + deltaX
          this.style.left = positionX + "px"
          this.style.width = width + "px"
          this.emit({ position: { x: positionX }, size: { width } })
        }
      } else if (side === "right") {
        const width = this.offsetWidth + deltaX
        if (width > minWidth) {
          this.style.width = width + "px"
          this.emit({ size: { width } })
        }
      }
    }
  }
  updatePreview = (element) => {
    element.value = element.value === "visible" ? "hidden" : "visible"
    this.emit({ preview: element.value === "visible" })
  }
  handleMessage = (event) => {
    const message = event.data
    switch (message.type) {
      case "preview":
        this.querySelector("button[name='preview']").value = message.value ? "visible" : "hidden"
        break
      case "input":
        break
      case "output":
        console.log(message)
    }
  }
  handleFormInput = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const data = new FormData(event.currentTarget)
    const input = {}
    for (let [key, value] of data) input[key] = value
    this.emit({ input })
    // switch (event.submitter.name) {
    //   case "open-file":
    //     console.log("open file")
    //     break
    //   default:
    //     break
    // }
  }
  handleFormOutput = (event) => {
    event.preventDefault()
    event.stopPropagation()
    console.log(event)

    // switch (event.submitter.name) {
    //   case "open-file":
    //     break
    //   default:
    //     console.log(event)
    //     break
    // }
  }
  handleFormHeader = (event) => {
    event.preventDefault()
    event.stopPropagation()
    switch (event.submitter.name) {
      case "preview":
        this.updatePreview(event.submitter)
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
        this.updateWidth(side, event.clientX - initialX, minWidth)
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
        this.updateWidth(side, event.touches[0].clientX - initialX, minWidth)
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
      this.updatePosition(event.clientX - initialX, event.clientY - initialY)
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
        this.updatePosition(event.touches[0].clientX - initialX, event.touches[0].clientY - initialY)
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
