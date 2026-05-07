import { setupLayout, card } from "../app.js";
import { listJobs } from "../modules/jobs.js";

setupLayout("jobs");

const listRoot = document.getElementById("jobs-list");
const search = document.getElementById("jobs-search");

async function render() {
  listRoot.innerHTML = '<div class="loader">Loading jobs...</div>';
  const res = await listJobs(search.value);
  if (!res.ok) {
    listRoot.innerHTML = `<p class="status-danger">${res.error}</p>`;
    return;
  }
  if (!res.data.length) {
    listRoot.innerHTML = '<div class="empty-state">No jobs match your search.</div>';
    return;
  }
  listRoot.innerHTML = `<div class="grid">${res.data.map((j) => card(j, "Open job")).join("")}</div>`;
}

search.addEventListener("input", render);
render();
