import { i18n } from "../utils.js"
export default function (obj, types) {
  const html = Object.entries(obj).map(([key, value]) => {
    switch (value.type) {
      case "string":
        types.add(value.type)
        return /*html*/ `
        <input-string 
          name="${key}"
          title="${i18n(value.title)}"
          value="${value.default || ""}"
        />
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
  return html.join("")
}
