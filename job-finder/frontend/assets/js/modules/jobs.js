import { apiRequest } from "../core/api.js";
import { addJob, getJobById, getJobs } from "../core/store.js";

export async function fetchJobs(query = "") {
  return apiRequest(() => {
    const normalized = query.trim().toLowerCase();
    const jobs = getJobs().filter((job) => {
      if (!normalized) return true;
      return [job.title, job.company, job.location, job.type].join(" ").toLowerCase().includes(normalized);
    });
    return jobs;
  });
}

export async function fetchJobDetails(id) {
  return apiRequest(() => {
    const job = getJobById(id);
    if (!job) throw new Error("Job not found.");
    return job;
  });
}

export async function createJob(payload) {
  return apiRequest(() => {
    const fields = ["title", "company", "location", "type", "salary", "summary"];
    for (const field of fields) {
      if (!String(payload[field] || "").trim()) throw new Error(`Field '${field}' is required.`);
    }
    return addJob(payload);
  });
}
