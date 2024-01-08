const css = String.raw
export default css`
  :host {
    font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 1rem;
    line-height: 1.5rem;
    --primary-50: rgb(var(--color-primary-50, 237 248 252)); /* ⬅ #edf8fc */
    --primary-100: rgb(var(--color-primary-100, 231 245 251)); /* ⬅ #e7f5fb */
    --primary-200: rgb(var(--color-primary-200, 225 243 250)); /* ⬅ #e1f3fa */
    --primary-300: rgb(var(--color-primary-300, 207 235 247)); /* ⬅ #cfebf7 */
    --primary-400: rgb(var(--color-primary-400, 171 221 241)); /* ⬅ #abddf1 */
    --primary-500: rgb(var(--color-primary-500, 135 206 235)); /* ⬅ #87ceeb */
    --primary-600: rgb(var(--color-primary-600, 122 185 212)); /* ⬅ #7ab9d4 */
    --primary-700: rgb(var(--color-primary-700, 101 155 176)); /* ⬅ #659bb0 */
    --primary-800: rgb(var(--color-primary-800, 81 124 141)); /* ⬅ #517c8d */
    --primary-900: rgb(var(--color-primary-900, 66 101 115)); /* ⬅ #426573 */

    --secondary-900: rgb(var(--color-secondary-900, 35 93 57) / 1);

    --surface-400: rgb(var(--color-surface-400, 116 130 151) / 1);
    --surface-500: rgb(var(--color-surface-500, 56 77 107) / 1);
    --surface-600: rgb(var(--color-surface-600, 50 69 96) / 1);
    --surface-700: rgb(var(--color-surface-700, 42 58 80) / 1);
    --surface-800: rgb(var(--color-surface-800, 34 46 64) / 1);
    --surface-900: rgb(var(--color-surface-900, 27 38 52) / 1);

    --box-shadow-lg-slate-900: 0 10px 15px -3px rgb(15, 23, 42), 0 4px 6px -2px rgb(15, 23, 42);
    --drop-shadow-lg: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1));

    --node-border-radius: 0.375rem;
  }
  @layer utils {
    .no-select {
      /* prevent-select */
      -webkit-user-select: none; /* Safari */
      -ms-user-select: none; /* IE 10 and IE 11 */
      user-select: none; /* Standard syntax */
      cursor: default;
    }
  }
  .port {
    --port-size: 12px;
    position: absolute;
    height: var(--port-size);
    width: var(--port-size);
    border-radius: 9999px;
    background-color: rgb(14 165 223);
    outline-style: solid;
    outline-width: 1px;
    outline-color: #020617;
    top: 8px;

    & button {
      --size: 22px;
      --position: -5px;
      position: absolute;
      background-color: transparent;
      border-radius: 9999px;
      height: var(--size);
      width: var(--size);
      left: var(--position);
      top: var(--position);
    }
  }
  output-port {
    right: -18px;
  }

  input-port {
    left: -18px;
  }

  button {
    padding: 0;
    background-color: transparent;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    & svg {
      width: 22px;
      height: 22px;
    }
    & path {
      transition: fill 0.1s ease-in-out;
      fill: var(--primary-200);
    }
    &:hover path {
      fill: var(--primary-50);
    }
  }
`
