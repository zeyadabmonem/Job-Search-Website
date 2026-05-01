import { apiRequest } from "../core/api.js";
import { clearCurrentUser, getState, setCurrentUser } from "../core/store.js";
import { emailFormat, minLength, required } from "../utils/validators.js";

function getUsers() {
  const users = localStorage.getItem("jobfinder_users");
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem("jobfinder_users", JSON.stringify(users));
}

export async function register(payload) {
  return apiRequest(() => {
    if (!required(payload.name) || !required(payload.email) || !required(payload.password)) {
      throw new Error("All fields are required.");
    }
    if (!emailFormat(payload.email)) throw new Error("Please enter a valid email address.");
    if (!minLength(payload.password, 8)) throw new Error("Password must be at least 8 characters.");
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error("An account with this email already exists.");
    }
    const user = {
      id: Date.now(),
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
      role: payload.role === "admin" ? "admin" : "user"
    };
    users.push(user);
    saveUsers(users);
    setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    return { user: getState().currentUser };
  });
}

export async function login(payload) {
  return apiRequest(() => {
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase() && u.password === payload.password);
    if (!user) throw new Error("Invalid email or password.");
    setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    return { user: getState().currentUser };
  });
}

export function logout() {
  clearCurrentUser();
}
