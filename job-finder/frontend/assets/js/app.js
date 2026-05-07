import { getState } from "./core/store.js";
import { logout } from "./modules/auth.js";

export function setupLayout(active) {
  const root = document.getElementById("app-navbar");
  if (!root) return;
  const state = getState();
  const authed = Boolean(state.currentUser);
  const links = [
    { id: "home", href: "home.html", label: "Home" },
    { id: "jobs", href: "jobs.html", label: "Jobs" }
  ];
  if (authed) links.push({ id: "dashboard", href: "dashboard.html", label: "Dashboard" });
  if (!authed) {
    links.push({ id: "login", href: "login.html", label: "Login" });
    links.push({ id: "register", href: "register.html", label: "Register" });
  }

  root.innerHTML = `
    <div class="navbar">
      <div class="container navbar-inner">
        <a class="nav-brand" href="home.html">JobFinder</a>
        <nav class="nav-links">
          ${links.map((l) => `<a class="nav-link ${active === l.id ? "active" : ""}" href="${l.href}">${l.label}</a>`).join("")}
          <button id="theme-toggle" class="btn btn-outline" type="button">Theme</button>
          ${authed ? `<button id="logout-btn" class="btn btn-outline" type="button">Logout</button>` : ""}
        </nav>
      </div>
    </div>
  `;

  const savedTheme = localStorage.getItem("jobfinder_theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  root.querySelector("#theme-toggle")?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("jobfinder_theme", next);
  });

  root.querySelector("#logout-btn")?.addEventListener("click", () => {
    logout();
    window.location.href = "home.html";
  });
}

export function card(job, action = "View details") {
  return `
    <article class="card stack-sm">
      <h3>${job.title}</h3>
      <p class="muted">${job.company} - ${job.location}</p>
      <p><span class="badge">${job.type}</span> <span class="badge">${job.salary}</span></p>
      <p>${job.summary}</p>
      <a class="btn btn-outline" href="job-details.html?id=${job.id}">${action}</a>
    </article>
  `;
}
