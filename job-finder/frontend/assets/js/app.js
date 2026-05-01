import { renderNavbar } from "./modules/navbar.js";
import { getItem, setItem } from "./utils/storage.js";

export function bootstrap(pageKey) {
  const savedTheme = getItem("jobfinder_theme", "light");
  document.documentElement.setAttribute("data-theme", savedTheme);
  renderNavbar(pageKey);
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const root = document.documentElement;
      const dark = root.getAttribute("data-theme") === "dark";
      const next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      setItem("jobfinder_theme", next);
    });
  }
}
