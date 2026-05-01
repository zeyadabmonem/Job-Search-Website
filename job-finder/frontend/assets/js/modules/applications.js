import { apiRequest } from "../core/api.js";
import { applyToJob, getApplicationsByUser, getJobById } from "../core/store.js";

export async function submitApplication({ userId, jobId }) {
  return apiRequest(() => {
    const result = applyToJob({ userId, jobId: Number(jobId) });
    if (!result.ok) throw new Error(result.message);
    return { success: true };
  });
}

export async function fetchAppliedJobs(userId) {
  return apiRequest(() => {
    const applications = getApplicationsByUser(userId);
    return applications
      .map((item) => ({ ...item, job: getJobById(item.jobId) }))
      .filter((item) => item.job);
  });
}
