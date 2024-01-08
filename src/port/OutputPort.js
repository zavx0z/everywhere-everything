import Port from "./Port.js"

const html = String.raw
const css = String.raw
class OutputPort extends Port {
  constructor() {
    super()
  }
  connectedCallback() {}

  disconnectedCallback() {}
}
customElements.define("output-port", OutputPort)
