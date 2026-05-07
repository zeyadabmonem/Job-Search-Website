import { setupLayout, card } from "../app.js";
import { listJobs } from "../modules/jobs.js";

setupLayout("home");

const target = document.getElementById("featured-jobs");

async function init() {
  target.innerHTML = '<div class="loader">Loading featured jobs...</div>';
  const res = await listJobs();
  if (!res.ok) {
    target.innerHTML = `<p class="status-danger">${res.error}</p>`;
    return;
  }
  const jobs = res.data.slice(0, 3);
  if (!jobs.length) {
    target.innerHTML = '<div class="empty-state">No jobs available right now.</div>';
    return;
  }
  target.innerHTML = `<div class="grid">${jobs.map((j) => card(j)).join("")}</div>`;
}

init();
