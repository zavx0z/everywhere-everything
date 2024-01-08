import Port from "./Port.js"

const html = String.raw
const css = String.raw

class InputPort extends Port {
  constructor() {
    super()
  }
  disconnectedCallback() {}
}
customElements.define("input-port", InputPort)
