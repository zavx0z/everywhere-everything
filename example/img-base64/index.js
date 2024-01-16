async function exec({ fileImg }) {
  const reader = new FileReader()
  reader.readAsDataURL(fileImg)
  return new Promise((res, rej) => {
    reader.onload = () => res(reader.result)
    reader.onerror = (error) => rej("Error: ", error)
  })
}
export default class extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }
  async exec({ fileImg }, { render }) {
    if (fileImg.size) {
      const base64 = await exec({ fileImg })
      if (render) this.render(base64)
      return { base64 }
    } else this.shadowRoot.innerHTML = ""
  }
  render(base64) {
    this.shadowRoot.innerHTML = /*html*/ `
    <style>
      img {
        width: 100%;
      }
    </style>
    <img src=${base64} alt="preview" />
    `
  }
}
