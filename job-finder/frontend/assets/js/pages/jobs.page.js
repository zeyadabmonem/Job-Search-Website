import { bootstrap } from "../app.js";
import { fetchJobs } from "../modules/jobs.js";
import { renderJobCard } from "../components/job-card.js";
import { createEmptyState, createLoader } from "../utils/dom.js";

bootstrap("jobs");

const listRoot = document.getElementById("jobs-list");
const searchInput = document.getElementById("jobs-search");

async function renderJobs() {
  listRoot.innerHTML = "";
  listRoot.appendChild(createLoader("Loading jobs..."));
  const result = await fetchJobs(searchInput.value);
  if (!result.ok) {
    listRoot.innerHTML = `<p class="status-danger">${result.error}</p>`;
    return;
  }
  if (!result.data.length) {
    listRoot.innerHTML = "";
    listRoot.appendChild(createEmptyState("No jobs match your search."));
    return;
  }
  listRoot.innerHTML = `<div class="grid">${result.data.map((job) => `
    ${renderJobCard(job, "Open job")}
  `).join("")}</div>`;
}

searchInput.addEventListener("input", renderJobs);
renderJobs();
