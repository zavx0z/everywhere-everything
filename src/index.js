import Params from "./components/Params.js"
import { i18n } from "./utils.js"

export default class Node extends HTMLElement {
  /** @type {ShadowRoot} */ #host
  constructor() {
    super()
    this.#host = this.attachShadow({ mode: "closed" })
    this.#host.innerHTML = /*html*/ `
    <link rel="stylesheet" href="src/styles.css" type="text/css">
    `
  }
//   <p class="description">
//   ${i18n(schema.description)}
// </p>
  async connectedCallback() {
    const schema = await fetch(this.getAttribute("schema")).then((data) => data.json())
    const template = document.createElement("template")
    template.innerHTML = /*html*/ `
    <div class="node">
      <div class="header">
        <h1 >
          ${i18n(schema.title)} 
        </h1>
        <button>
          <svg 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="426.004 433 12.9912 9.00195" 
            width="24px" 
            height="24px"
          >
            <path 
              fill="#4d4a4a"
              opacity="1"
              stroke="none"
              d="M432.5 433C429.222 432.999 427.464 435.721 426.136 437.162C425.96 437.354 425.96 437.648 426.136 437.84C427.464 439.281 429.222 442 432.5 442.002C435.778 442.004 437.536 439.281 438.863 437.84C439.039 437.648 439.039 437.354 438.863 437.162C437.535 435.721 435.777 433.001 432.5 433ZM432.5 434C434.433 434 436 435.567 436 437.5C436 439.433 434.433 441 432.5 441C430.567 441 429 439.433 429 437.5C429 435.567 430.567 434 432.5 434ZM432.5 436C431.671 436 431 436.672 431 437.5C431 438.328 431.671 439 432.5 439C433.328 439 434 438.328 434 437.5C434 436.672 433.328 436 432.5 436Z"
            />
          </svg>
        </button>        
      </div>
      <div class="node-body">
        <div>
          ${Params(schema.input, "input")}
        </div>
        <div>
          ${Params(schema.output, "output")}
        </div>
      </div>
    </div>
    `
    this.#host.appendChild(template.content)
  }
}
