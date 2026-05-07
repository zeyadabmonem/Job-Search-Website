import { setupLayout } from "../app.js";
import { login } from "../modules/auth.js";

setupLayout("login");

const form = document.getElementById("login-form");
const msg = document.getElementById("login-msg");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  msg.textContent = "Signing in...";
  const res = await login({
    email: String(data.get("email") || "").trim(),
    password: String(data.get("password") || "")
  });
  if (!res.ok) {
    msg.textContent = res.error;
    msg.className = "status-danger";
    return;
  }
  msg.textContent = "Welcome back. Redirecting...";
  msg.className = "status-success";
  setTimeout(() => (window.location.href = "dashboard.html"), 350);
});
