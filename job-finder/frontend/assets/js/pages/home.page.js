import { bootstrap } from "../app.js";
import { fetchJobs } from "../modules/jobs.js";
import { renderJobCard } from "../components/job-card.js";
import { createEmptyState, createLoader } from "../utils/dom.js";

bootstrap("home");

const featured = document.getElementById("featured-jobs");

async function loadFeatured() {
  featured.innerHTML = "";
  featured.appendChild(createLoader("Loading featured jobs..."));
  const response = await fetchJobs();
  if (!response.ok) {
    featured.innerHTML = `<p class="status-danger">${response.error}</p>`;
    return;
  }
  const top = response.data.slice(0, 3);
  if (!top.length) {
    featured.innerHTML = "";
    featured.appendChild(createEmptyState("No jobs available right now."));
    return;
  }
  featured.innerHTML = `<div class="grid">${top.map((job) => `
    ${renderJobCard(job)}
  `).join("")}</div>`;
}

loadFeatured();
