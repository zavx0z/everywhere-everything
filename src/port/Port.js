const html = String.raw
export default class Port extends HTMLElement {
  constructor() {
    super()
    this.className = "port"
    this.innerHTML = html`<button></button>`
    this.addEventListener("mouseenter", (event) => {
      event.preventDefault()
      event.stopPropagation()
      console.log(event.target)
    })
  }
}
