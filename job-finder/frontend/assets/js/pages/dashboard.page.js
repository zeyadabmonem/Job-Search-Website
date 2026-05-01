import { bootstrap } from "../app.js";
import { requireAuth } from "../core/auth-guard.js";
import { getState } from "../core/store.js";
import { fetchAppliedJobs } from "../modules/applications.js";
import { createJob } from "../modules/jobs.js";
import { createEmptyState, createLoader } from "../utils/dom.js";

bootstrap("dashboard");

const state = getState();
const userInfo = document.getElementById("user-info");
const appliedRoot = document.getElementById("applied-jobs");
const adminPanel = document.getElementById("admin-panel");
const createForm = document.getElementById("create-job-form");
const createFeedback = document.getElementById("create-feedback");

if (!requireAuth()) {
  // Redirect handled by guard.
} else {
  userInfo.textContent = `${state.currentUser.name} (${state.currentUser.role})`;

  if (state.currentUser.role === "admin") {
    adminPanel.classList.remove("hidden");
    createForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(createForm);
      createFeedback.textContent = "Publishing job...";
      createFeedback.className = "status-info";
      const result = await createJob({
        title: data.get("title"),
        company: data.get("company"),
        location: data.get("location"),
        type: data.get("type"),
        salary: data.get("salary"),
        summary: data.get("summary")
      });
      if (!result.ok) {
        createFeedback.textContent = result.error;
        createFeedback.className = "status-danger";
        return;
      }
      createFeedback.textContent = "Job created successfully.";
      createFeedback.className = "status-success";
      createForm.reset();
    });
  }

  renderApplications();
}

async function renderApplications() {
  appliedRoot.innerHTML = "";
  appliedRoot.appendChild(createLoader("Loading your applications..."));
  const response = await fetchAppliedJobs(state.currentUser.id);
  if (!response.ok) {
    appliedRoot.innerHTML = `<p class="status-danger">${response.error}</p>`;
    return;
  }
  if (!response.data.length) {
    appliedRoot.innerHTML = "";
    appliedRoot.appendChild(createEmptyState("You have not applied to any jobs yet."));
    return;
  }
  appliedRoot.innerHTML = `<div class="stack-sm">${response.data.map((item) => `
    <article class="card">
      <h3>${item.job.title}</h3>
      <p class="muted">${item.job.company} - ${item.job.location}</p>
    </article>
  `).join("")}</div>`;
}

