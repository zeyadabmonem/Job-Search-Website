import { setupLayout } from "../app.js";
import { getState } from "../core/store.js";
import { applyToJob } from "../modules/applications.js";
import { jobDetails } from "../modules/jobs.js";

setupLayout("jobs");

const root = document.getElementById("job-details");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

function openModal(title, message, onConfirm) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal stack-md">
      <h3>${title}</h3>
      <p class="muted">${message}</p>
      <button id="modal-ok" class="btn btn-primary" type="button">Continue</button>
    </div>
  `;
  document.body.appendChild(backdrop);
  backdrop.querySelector("#modal-ok").addEventListener("click", () => {
    backdrop.remove();
    if (typeof onConfirm === "function") onConfirm();
  });
}

async function init() {
  root.innerHTML = '<div class="loader">Loading job details...</div>';
  const res = await jobDetails(id);
  if (!res.ok) {
    root.innerHTML = `<p class="status-danger">${res.error}</p>`;
    return;
  }
  const job = res.data;
  root.innerHTML = `
    <article class="card stack-md">
      <div class="stack-sm">
        <h1>${job.title}</h1>
        <p class="muted">${job.company} - ${job.location}</p>
        <p><span class="badge">${job.type}</span> <span class="badge">${job.salary}</span></p>
      </div>
      <p>${job.summary}</p>
      <p id="apply-msg" class="muted"></p>
      <button id="apply-btn" class="btn btn-primary" type="button">Apply now</button>
    </article>
  `;

  document.getElementById("apply-btn").addEventListener("click", async () => {
    const user = getState().currentUser;
    if (!user) {
      openModal("Sign in required", "Please login before applying.", () => (window.location.href = "login.html"));
      return;
    }
    const result = await applyToJob(user.id, job.id);
    const msg = document.getElementById("apply-msg");
    if (!result.ok) {
      msg.textContent = result.error;
      msg.className = "status-danger";
      return;
    }
    msg.textContent = "Application sent successfully.";
    msg.className = "status-success";
  });
}

init();
