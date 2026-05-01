const APP_KEY = "jobfinder_state";

const initialState = {
  currentUser: null,
  jobs: [
    { id: 1, title: "Senior Backend Engineer", company: "Nexa Labs", location: "Cairo, Egypt", type: "Full-time", salary: "$4,000 - $5,500", summary: "Design and scale APIs for the core hiring platform.", postedAt: "2026-04-28" },
    { id: 2, title: "Frontend Engineer", company: "Atlas Commerce", location: "Alexandria, Egypt", type: "Hybrid", salary: "$3,200 - $4,200", summary: "Build performant web interfaces with strong UX standards.", postedAt: "2026-04-30" },
    { id: 3, title: "Product Designer", company: "Blue Harbor", location: "Remote", type: "Remote", salary: "$2,800 - $3,800", summary: "Own product workflows and design system consistency.", postedAt: "2026-04-27" }
  ],
  applications: []
};

function loadState() {
  const raw = localStorage.getItem(APP_KEY);
  if (!raw) return structuredClone(initialState);
  try {
    return JSON.parse(raw);
  } catch {
    return structuredClone(initialState);
  }
}

let state = loadState();

function persist() {
  localStorage.setItem(APP_KEY, JSON.stringify(state));
}

export function getState() {
  return structuredClone(state);
}

export function setCurrentUser(user) {
  state.currentUser = user;
  persist();
}

export function clearCurrentUser() {
  state.currentUser = null;
  persist();
}

export function getJobs() {
  return [...state.jobs];
}

export function getJobById(id) {
  return state.jobs.find((job) => job.id === Number(id)) || null;
}

export function getApplicationsByUser(userId) {
  return state.applications.filter((item) => item.userId === userId);
}

export function applyToJob({ userId, jobId }) {
  const exists = state.applications.some((item) => item.userId === userId && item.jobId === jobId);
  if (exists) return { ok: false, message: "You already applied to this job." };
  state.applications.push({ userId, jobId, appliedAt: new Date().toISOString() });
  persist();
  return { ok: true };
}

export function addJob(jobInput) {
  const nextId = Math.max(0, ...state.jobs.map((j) => j.id)) + 1;
  const job = { id: nextId, postedAt: new Date().toISOString().slice(0, 10), ...jobInput };
  state.jobs.unshift(job);
  persist();
  return job;
}
