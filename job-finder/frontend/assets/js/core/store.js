const KEY = "jobfinder_state_v2";

const defaults = {
  currentUser: null,
  jobs: [
    { id: 1, title: "Senior Backend Engineer", company: "Nexa Labs", location: "Cairo", type: "Full-time", salary: "$4,000-$5,500", summary: "Build and scale backend APIs for recruitment services.", postedAt: "2026-05-01" },
    { id: 2, title: "Frontend Engineer", company: "Atlas Commerce", location: "Alexandria", type: "Hybrid", salary: "$3,200-$4,000", summary: "Ship maintainable interfaces and component architecture.", postedAt: "2026-05-01" },
    { id: 3, title: "Product Designer", company: "Blue Harbor", location: "Remote", type: "Remote", salary: "$2,800-$3,600", summary: "Lead product UX, prototyping, and design system quality.", postedAt: "2026-04-30" }
  ],
  applications: []
};

function load() {
  try {
    const value = localStorage.getItem(KEY);
    return value ? JSON.parse(value) : structuredClone(defaults);
  } catch {
    return structuredClone(defaults);
  }
}

let state = load();

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function getState() {
  return structuredClone(state);
}

export function setCurrentUser(user) {
  state.currentUser = user;
  save();
}

export function clearCurrentUser() {
  state.currentUser = null;
  save();
}

export function allJobs() {
  return [...state.jobs];
}

export function byId(id) {
  return state.jobs.find((j) => j.id === Number(id)) || null;
}

export function addJob(payload) {
  const id = Math.max(0, ...state.jobs.map((j) => j.id)) + 1;
  const job = { id, postedAt: new Date().toISOString().slice(0, 10), ...payload };
  state.jobs.unshift(job);
  save();
  return job;
}

export function apply(userId, jobId) {
  if (state.applications.some((a) => a.userId === userId && a.jobId === jobId)) {
    return { ok: false, message: "You already applied to this role." };
  }
  state.applications.push({ userId, jobId, appliedAt: new Date().toISOString() });
  save();
  return { ok: true };
}

export function appsForUser(userId) {
  return state.applications.filter((a) => a.userId === userId);
}
