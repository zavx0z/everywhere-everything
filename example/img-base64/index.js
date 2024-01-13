async function getBase64(file) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  return new Promise((res, rej) => {
    reader.onload = function () {
      return res(reader.result)
    }
    reader.onerror = function (error) {
      return rej("Error: ", error)
    }
  })
}
export default class extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }
  async exec({ filePath }, { render }) {
    const base64 = await getBase64(filePath)
    if (render) this.render(base64)
    return { base64 }
  }
  async render(base64) {
    this.shadowRoot.innerHTML = /*html*/ `
    <style>
      img {
        width: 100%;
        height: 100%;
      }
    </style>
    <img src=${base64} alt="preview" />
    `
  }
}
