export function initState(id) {
  const state = localStorage.getItem(id)
  const snapshot = state
    ? JSON.parse(state)
    : { position: { x: 0, y: 0 }, size: { width: 350 }, preview: true }
  localStorage.setItem(id, JSON.stringify(snapshot))
  return snapshot
}
export function updateState(id, patch) {
  const state = JSON.parse(localStorage.getItem(id))
  function upd(state, patch) {
    for (let key in patch)
      state[key] = typeof patch[key] === "object" ? upd(state[key], patch[key]) : (state[key] = patch[key])
    return state
  }
  const newState = upd(state, patch)
  localStorage.setItem(id, JSON.stringify(newState))
}
