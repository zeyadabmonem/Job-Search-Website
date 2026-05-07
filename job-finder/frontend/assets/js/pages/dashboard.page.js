import { setupLayout, card } from "../app.js";
import { getState } from "../core/store.js";
import { myApplications } from "../modules/applications.js";
import { createJob } from "../modules/jobs.js";

setupLayout("dashboard");

const state = getState();
if (!state.currentUser) {
  window.location.href = "login.html";
}

if (state.currentUser) {
  document.getElementById("user-info").textContent = `${state.currentUser.name} (${state.currentUser.role})`;

  const appsRoot = document.getElementById("my-apps");
  const adminPanel = document.getElementById("admin-panel");
  const createForm = document.getElementById("create-job-form");
  const createMsg = document.getElementById("create-msg");

  async function renderApps() {
    appsRoot.innerHTML = '<div class="loader">Loading your applications...</div>';
    const res = await myApplications(state.currentUser.id);
    if (!res.ok) {
      appsRoot.innerHTML = `<p class="status-danger">${res.error}</p>`;
      return;
    }
    if (!res.data.length) {
      appsRoot.innerHTML = '<div class="empty-state">You have not applied to any jobs yet.</div>';
      return;
    }
    appsRoot.innerHTML = `<div class="grid">${res.data.map((item) => card(item.job)).join("")}</div>`;
  }

  if (state.currentUser.role === "admin") {
    adminPanel.hidden = false;
    createForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(createForm);
      const res = await createJob({
        title: String(data.get("title") || ""),
        company: String(data.get("company") || ""),
        location: String(data.get("location") || ""),
        type: String(data.get("type") || ""),
        salary: String(data.get("salary") || ""),
        summary: String(data.get("summary") || "")
      });
      if (!res.ok) {
        createMsg.textContent = res.error;
        createMsg.className = "status-danger";
        return;
      }
      createMsg.textContent = "Job posted successfully.";
      createMsg.className = "status-success";
      createForm.reset();
    });
  }

  renderApps();
}
