import { clearCurrentUser, getState, setCurrentUser } from "../core/store.js";

function users() {
  return JSON.parse(localStorage.getItem("jobfinder_users") || "[]");
}

function saveUsers(value) {
  localStorage.setItem("jobfinder_users", JSON.stringify(value));
}

export async function register(input) {
  const list = users();
  if (list.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    return { ok: false, error: "Email already exists." };
  }
  if (input.password.trim().length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  const user = { id: Date.now(), ...input };
  list.push(user);
  saveUsers(list);
  setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
  return { ok: true, data: getState().currentUser };
}

export async function login(input) {
  const user = users().find((u) => u.email.toLowerCase() === input.email.toLowerCase() && u.password === input.password);
  if (!user) return { ok: false, error: "Invalid email or password." };
  setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
  return { ok: true, data: getState().currentUser };
}

export function logout() {
  clearCurrentUser();
}
