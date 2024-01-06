const css = String.raw
export default css`
  preview-window {
    display: flex;
    position: absolute;
    width: calc(100% - var(--node-border-radius) * 2);
    left: var(--node-border-radius);
    border-radius: var(--node-border-radius) var(--node-border-radius) 0 0;
    border-style: solid;
    border-width: 2px 2px 0 2px;
    box-sizing: border-box;
    border-color: rgb(15, 23, 42);
    bottom: 100%;
    aspect-ratio: 16 / 9;
    z-index: 4;
    padding: 0.2rem;

    & > div:first-of-type {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      filter: blur(3px);
      z-index: -1;
      background-color: var(--surface-500);
    }

    & > div:last-of-type {
      --color: var(--surface-800);
      --size: 14px;
      position: relative;
      width: 100%;
      height: 100%;
      border: 2px;
      border-color: var(--surface-800);
      border-style: solid;
      background-image: linear-gradient(
          45deg,
          var(--color) 25%,
          transparent 25%,
          transparent 75%,
          var(--color) 75%,
          var(--color)
        ),
        linear-gradient(45deg, var(--color) 25%, transparent 25%, transparent 75%, var(--color) 75%, var(--color));
      background-size: var(--size) var(--size); /* Размер ячеек сетки */
      background-position: 0 0, calc(var(--size) / 2) calc(var(--size) / 2); /* Смещение для создания эффекта шахматной доски */
      border-radius: calc(var(--node-border-radius) / 2);
    }
  }
`
