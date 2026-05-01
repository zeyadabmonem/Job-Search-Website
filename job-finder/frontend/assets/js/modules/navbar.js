import { getState } from "../core/store.js";
import { logout } from "./auth.js";

export function renderNavbar(activePage) {
  const root = document.getElementById("app-navbar");
  if (!root) return;
  const { currentUser } = getState();
  const isAuthed = Boolean(currentUser);
  const links = [
    { href: "home.html", key: "home", label: "Home" },
    { href: "jobs.html", key: "jobs", label: "Jobs" }
  ];
  if (isAuthed) {
    links.push({ href: "dashboard.html", key: "dashboard", label: "Dashboard" });
  } else {
    links.push({ href: "login.html", key: "login", label: "Login" });
    links.push({ href: "register.html", key: "register", label: "Register" });
  }

  root.innerHTML = `
    <div class="navbar">
      <div class="container navbar-inner">
        <a class="nav-brand" href="home.html">JobFinder</a>
        <nav class="nav-links">
          ${links.map((link) => `<a class="nav-link ${activePage === link.key ? "active" : ""}" href="${link.href}">${link.label}</a>`).join("")}
          <button id="theme-toggle" class="btn btn-outline" type="button">Theme</button>
          ${isAuthed ? `<button id="logout-btn" class="btn btn-outline">Logout</button>` : ""}
        </nav>
      </div>
    </div>
  `;

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      logout();
      window.location.href = "home.html";
    });
  }
}
