export function createLoader(text = "Loading...") {
  const wrapper = document.createElement("div");
  wrapper.className = "loader";
  wrapper.textContent = text;
  return wrapper;
}

export function createEmptyState(text) {
  const wrapper = document.createElement("div");
  wrapper.className = "empty-state";
  wrapper.textContent = text;
  return wrapper;
}
