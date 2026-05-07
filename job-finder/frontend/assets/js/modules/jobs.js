import { addJob, allJobs, byId } from "../core/store.js";

export async function listJobs(query = "") {
  const q = query.trim().toLowerCase();
  const data = allJobs().filter((j) => !q || `${j.title} ${j.company} ${j.location} ${j.type}`.toLowerCase().includes(q));
  return { ok: true, data };
}

export async function jobDetails(id) {
  const job = byId(id);
  return job ? { ok: true, data: job } : { ok: false, error: "Job not found." };
}

export async function createJob(payload) {
  const fields = ["title", "company", "location", "type", "salary", "summary"];
  for (const field of fields) {
    if (!String(payload[field] || "").trim()) return { ok: false, error: `Missing ${field}.` };
  }
  return { ok: true, data: addJob(payload) };
}
