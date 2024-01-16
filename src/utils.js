export const load = (URI) =>
  Promise.all([
    fetch(URI + "/schema.json").then((data) => data.json()),
    import(URI + "/index.js").then((module) => module),
  ]).then(([schema, module]) => {
    delete schema["$schema"]
    return { schema, element: module.default }
  })
