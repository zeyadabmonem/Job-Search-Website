import { bootstrap } from "../app.js";
import { login } from "../modules/auth.js";
import { emailFormat, required } from "../utils/validators.js";

bootstrap("login");

const form = document.getElementById("login-form");
const feedback = document.getElementById("login-feedback");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const email = data.get("email");
  const password = data.get("password");
  if (!required(email) || !required(password)) {
    feedback.textContent = "Email and password are required.";
    feedback.className = "status-danger";
    return;
  }
  if (!emailFormat(email)) {
    feedback.textContent = "Please provide a valid email address.";
    feedback.className = "status-danger";
    return;
  }
  feedback.textContent = "Signing in...";
  feedback.className = "status-info";
  const result = await login({
    email,
    password
  });
  if (!result.ok) {
    feedback.textContent = result.error;
    feedback.className = "status-danger";
    return;
  }
  feedback.textContent = "Login successful. Redirecting...";
  feedback.className = "status-success";
  window.setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 350);
});
