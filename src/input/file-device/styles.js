const css = String.raw
export default css`
  .param {
    display: grid;
    grid-template-columns: auto max-content;
    grid-template-rows: 28px;
    position: relative;

    & label {
      font-size: 16px;
      font-weight: 400;
      line-height: 1.5;
      letter-spacing: 0px;
      filter: var(--drop-shadow-lg);
      white-space: nowrap; /* Запретить перенос текста на новую строку */
      overflow: hidden; /* Скрыть содержимое, выходящее за границы элемента */
      text-overflow: ellipsis; /* Добавить многоточие, если текст не влезает */
      display: block; /* или inline-block, в зависимости от контекста */
      width: 100px; /* Задать фиксированную ширину или другое ограничение по ширине */
    }
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
`
