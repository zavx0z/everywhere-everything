const css = String.raw
export default css`
  :host {
    position: relative;
    display: grid;
    width: 22rem;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-template-rows: 2rem max-content;
    border-radius: var(--node-border-radius);
    background-color: var(--surface-700);
    box-shadow: 0px 3px 5px 4px rgba(15, 23, 42, 0.8);
    z-index: 4;
  }
`
