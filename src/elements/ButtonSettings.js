const html = String.raw
class ButtonSettings extends HTMLElement {
  /** @type {HTMLButtonElement} */ #button
  constructor() {
    super()
    this.innerHTML = html`
      <button>
        <svg version="1.1" viewBox="279 536 14 14" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="1"
            stroke="none"
            d="M285 536L284.844 537.906C284.221 538.049 283.767 538.158 283.25 538.5L281.5 537L280 538.5L281.5 540.25C281.158 540.767 281.049 541.221 280.906 541.844L279 542L279 543L279 544L280.906 544.156C281.049 544.779 281.158 545.233 281.5 545.75L280 547.5L281.5 549L283.25 547.5C283.767 547.842 284.221 547.951 284.844 548.094L285 550L286 550L287 550L287.156 548.094C287.779 547.951 288.233 547.842 288.75 547.5L290.5 549L292 547.5L290.5 545.75C290.842 545.233 290.951 544.779 291.094 544.156L293 544L293 543L293 542L291.094 541.844C290.951 541.221 290.842 540.767 290.5 540.25L292 538.5L290.5 537L288.75 538.5C288.233 538.158 287.779 538.049 287.156 537.906L287 536L286 536L285 536ZM286 541C287.116 541 288 541.884 288 543C288 544.116 287.116 545 286 545C284.884 545 284 544.116 284 543C284 541.884 284.884 541 286 541Z" />
        </svg>
      </button>
    `
    this.#button = this.querySelector("button")
  }
  connectedCallback() {
    this.#button.addEventListener("click", this.#handleClick)
    this.#button.addEventListener("touchstart", this.#handleClick)
  }
  disconnectedCallback() {
    this.#button.removeEventListener("click", this.#handleClick)
    this.#button.removeEventListener("touchstart", this.#handleClick)
  }
  #handleClick = (event) => {
    event.stopPropagation()
    this.open = !this.open
    this.dispatchEvent(new CustomEvent("toggleSettings"))
  }
  static get observedAttributes() {
    return ["open"]
  }
  attributeChangedCallback() {}
  get open() {
    return this.getAttribute("open") === "true"
  }
  set open(value) {
    this.setAttribute("open", value)
  }
}
customElements.define("button-settings", ButtonSettings)
