import { getState } from "./store.js";

export function requireAuth(redirectTo = "login.html") {
  if (!getState().currentUser) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}
