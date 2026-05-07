import { setupLayout } from "../app.js";
import { register } from "../modules/auth.js";

setupLayout("register");

const form = document.getElementById("register-form");
const msg = document.getElementById("register-msg");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  msg.textContent = "Creating account...";
  const res = await register({
    name: String(data.get("name") || "").trim(),
    email: String(data.get("email") || "").trim(),
    password: String(data.get("password") || ""),
    role: String(data.get("role") || "user")
  });
  if (!res.ok) {
    msg.textContent = res.error;
    msg.className = "status-danger";
    return;
  }
  msg.textContent = "Account created. Redirecting...";
  msg.className = "status-success";
  setTimeout(() => (window.location.href = "dashboard.html"), 350);
});
