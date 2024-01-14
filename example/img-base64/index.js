async function getBase64(file) {
  const reader = new FileReader()
  reader.readAsDataURL(file)
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
    console.log("base64", fileImg)
    if (fileImg.size) {
      const base64 = await getBase64(fileImg)
      if (render) this.render(base64)
      return { base64 }
    } else this.shadowRoot.innerHTML = ""
  }
  render(base64) {
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
