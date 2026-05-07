import { appsForUser, apply, byId } from "../core/store.js";

export async function applyToJob(userId, jobId) {
  const result = apply(userId, Number(jobId));
  return result.ok ? { ok: true } : { ok: false, error: result.message };
}

export async function myApplications(userId) {
  const data = appsForUser(userId).map((item) => ({ ...item, job: byId(item.jobId) })).filter((item) => item.job);
  return { ok: true, data };
}
