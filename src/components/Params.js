import { i18n } from "../utils.js"
export default function (obj, directional) {
  const html = Object.entries(obj)
    .map(([key, value]) => {
      switch (value.type) {
        case "string":
          return /*html*/ `
          <div class="socket">
            <div class="socket-port-${directional}"></div>
            <label 
              class="socket-label"
              for="${key}"
            >
              ${i18n(value.title)}
            </label>
            <input
              class="socket-input"
              type="text"
              name="${key}"
              value="${value.default || ""}"
            />
          </div>
        `
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
    .join("")
  return html
}
