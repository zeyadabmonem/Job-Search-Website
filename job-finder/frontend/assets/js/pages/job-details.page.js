import { bootstrap } from "../app.js";
import { getState } from "../core/store.js";
import { submitApplication } from "../modules/applications.js";
import { fetchJobDetails } from "../modules/jobs.js";
import { openModal } from "../modules/modal.js";
import { createLoader } from "../utils/dom.js";
import { formatDate } from "../utils/formatters.js";

bootstrap("jobs");

const root = document.getElementById("job-details");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function init() {
  root.innerHTML = "";
  root.appendChild(createLoader("Loading job details..."));
  const result = await fetchJobDetails(id);
  if (!result.ok) {
    root.innerHTML = `<p class="status-danger">${result.error}</p>`;
    return;
  }
  const job = result.data;
  root.innerHTML = `
    <article class="card stack-md">
      <div>
        <h1>${job.title}</h1>
        <p class="muted">${job.company} - ${job.location}</p>
        <p class="muted">Posted ${formatDate(job.postedAt)}</p>
      </div>
      <p>${job.summary}</p>
      <p><span class="badge">${job.type}</span> <span class="badge">${job.salary}</span></p>
      <div id="apply-feedback" class="muted"></div>
      <button id="apply-btn" class="btn btn-primary">Apply Now</button>
    </article>
  `;

  document.getElementById("apply-btn").addEventListener("click", async () => {
    const user = getState().currentUser;
    const feedback = document.getElementById("apply-feedback");
    if (!user) {
      openModal({
        title: "Login required",
        message: "You need to sign in before you can apply to this role.",
        confirmText: "Go to login",
        onConfirm: () => {
          window.location.href = "login.html";
        }
      });
      return;
    }
    const applyResult = await submitApplication({ userId: user.id, jobId: job.id });
    if (!applyResult.ok) {
      feedback.textContent = applyResult.error;
      feedback.className = "status-danger";
      return;
    }
    feedback.textContent = "Application submitted successfully.";
    feedback.className = "status-success";
  });
}

init();
