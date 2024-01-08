const css = String.raw
const html = String.raw
const styles = css`
  :host {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 2rem;
    gap: 0.25rem;
    border-radius: 0 0 var(--node-border-radius) var(--node-border-radius);
    padding: 0.5rem 0.75rem;
    z-index: 1;

    & > div {
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap: 0.5rem;
      padding: 0.25rem 0;
      z-index: 2;
    }
  }
`
class NodeBody extends HTMLElement {
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
  connectedCallback() {}
  static get observedAttributes() {
    return []
  }
  attributeChangedCallback(name, oldValue, newValue) {}
}
customElements.define("node-body", NodeBody)
