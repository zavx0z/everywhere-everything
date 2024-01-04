import { i18n } from "../utils.js"
export default function (obj, directional) {
  const html = Object.entries(obj)
    .map(([key, value]) => {
      switch (value.type) {
        case "string":
          return /*html*/ `
          <div class="param">
            <div class="port ${directional}"></div>
            <label 
              class="no-select"
              for="${key}"
            >
              ${i18n(value.title)}
            </label>
            <input
              type="text"
              name="${key}"
              value="${value.default || ""}"
            />
          </div>
        `.trim()
        // case "number":
        //   return /*html*/ `
        //   <input
        //     type="number"
        //     name="${key}"
        //     value="${value.default || ""}"
        //   />`
        // case "boolean":
        //   return /*html*/ `
        //   <input
        //     type="checkbox"
        //     name="${key}"
        //     ${value.default ? "checked" : ""}
        //   />`
        default:
          return ""
      }
    })
    .join("").trim()
  return html
}
