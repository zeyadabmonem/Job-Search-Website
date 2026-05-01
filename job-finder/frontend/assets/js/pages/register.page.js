import { bootstrap } from "../app.js";
import { register } from "../modules/auth.js";
import { emailFormat, minLength, required } from "../utils/validators.js";

bootstrap("register");

const form = document.getElementById("register-form");
const feedback = document.getElementById("register-feedback");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name");
  const email = data.get("email");
  const password = data.get("password");
  if (!required(name) || !required(email) || !required(password)) {
    feedback.textContent = "All fields are required.";
    feedback.className = "status-danger";
    return;
  }
  if (!emailFormat(email)) {
    feedback.textContent = "Please provide a valid email address.";
    feedback.className = "status-danger";
    return;
  }
  if (!minLength(password, 8)) {
    feedback.textContent = "Password must be at least 8 characters.";
    feedback.className = "status-danger";
    return;
  }
  feedback.textContent = "Creating account...";
  feedback.className = "status-info";
  const result = await register({
    name,
    email,
    password,
    role: data.get("role")
  });
  if (!result.ok) {
    feedback.textContent = result.error;
    feedback.className = "status-danger";
    return;
  }
  feedback.textContent = "Registration successful. Redirecting...";
  feedback.className = "status-success";
  window.setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 350);
});
