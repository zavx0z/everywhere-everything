const css = String.raw
export default css`
  .param {
    display: flex;
    position: relative;
    justify-content: space-between;
    gap: 0.5rem;
    .port {
      position: absolute;
      height: 0.75rem;
      width: 0.75rem;
      border-radius: 9999px;
      background-color: rgb(14 165 223);
      outline-style: solid;
      outline-width: 1px;
      outline-color: #020617;
      left: -1.125rem;
      top: 0.5rem;
    }
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
      display: flex;
      min-height: 28px;
      flex-grow: 1;
      resize: both;
      appearance: none;
      white-space: pre-wrap;
      border-radius: 4px;
      background-color: var(--surface-600);
      padding: 0 0.5rem;
      border: none;
      transition: background-color 0.2s ease-in-out;
      &:hover {
        background-color: var(--surface-500);
      }
      &:focus {
        background-color: var(--surface-600);
        outline: 2px solid transparent;
        outline-offset: 2px;
      }
    }
  }
`
