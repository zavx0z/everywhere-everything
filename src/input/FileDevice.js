import "../port/InputPort.js"
const html = String.raw
const css = String.raw
class FileDevice extends HTMLElement {
  constructor() {
    super()
    this.innerHTML = /*html*/ ` <style> 
      ${css`
        input-file-device {
          display: grid;
          grid-template-columns: auto max-content;
          grid-template-rows: 28px;
          position: relative;

          & input {
            caret-color: aqua;
            color: aqua;
            min-height: 28px;
            resize: both;
            appearance: none;
            white-space: pre-wrap;
            border-radius: 4px 0 0 4px;
            background-color: var(--surface-900);
            padding: 0 0.5rem;
            border: 1px solid var(--surface-500);
            transition: opacity 0.1s ease-in-out;

            &:hover {
              background-color: var(--surface-800);
            }
            &:focus {
              background-color: var(--surface-800);
              outline: 2px solid transparent;
              outline-offset: 2px;
            }
          }
          & span {
            & button {
              padding: 4px;
              background-color: var(--surface-500);
              border: 1px solid var(--surface-500);
            }
            & button:hover {
              background-color: var(--surface-600);
            }
            & button:active {
              background-color: var(--surface-00);
            }

            & button:last-child {
              border-radius: 0 4px 4px 0;
            }
            & svg {
              width: 20px;
              height: 20px;
            }
            & svg:hover path {
              fill: var(--primary-50);
            }
          }
        }
      `}
    </style> `
  }
  static get observedAttributes() {
    return ["label"]
  }
  get label() {
    return this.getAttribute("label")
  }
  set label(val) {
    this.setAttribute("label", val)
  }
  connectedCallback() {
    const key = this.getAttribute("key")
    this.innerHTML += html`
      <input-port></input-port>
      <input type="text" disabled name="${key}" placeholder="${this.label}" />
      <span>
        <button title="open">
          <svg version="1.1" viewBox="363 75 14 13" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M363.5 75C363.224 75 363 75.2239 363 75.5L363 79L377 79L377 77.5C377 77.2239 376.776 77 376.5 77L368 77L368 75.5C368 75.2239 367.776 75 367.5 75L363.5 75Z" />
            <path
              d="M363.5 80C363.224 80 363 80.2239 363 80.5L363 87.5C363 87.7761 363.224 88 363.5 88L376.5 88C376.776 88 377 87.7761 377 87.5L377 80.5C377 80.2239 376.776 80 376.5 80L363.5 80Z" />
          </svg>
        </button>
      </span>
    `
  }
}
customElements.define("input-file-device", FileDevice)
