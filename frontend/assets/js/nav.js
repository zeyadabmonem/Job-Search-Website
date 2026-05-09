document.addEventListener("DOMContentLoaded", function () {
  var list = document.getElementById("nav-links");
  var user = JobStorage.getUser();
  var current = "";

  try {
    current = window.parent.location.pathname;
  } catch (e) {}

  /* ── Helper: nav link item ── */
  function navItem(href, label) {
    var li = document.createElement("li");
    var a = document.createElement("a");

    a.href = href;
    a.target = "_top";
    a.textContent = label;

    if (current.endsWith(href)) {
      a.classList.add("active");
    }

    li.appendChild(a);
    return li;
  }

  /* ── Helper: logout item ── */
  function logoutItem() {
    var li = document.createElement("li");
    li.className = "nav-logout";

    var a = document.createElement("a");
    a.href = "#";
    a.textContent = "Logout";

    a.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("jf_user");
      window.top.location.href = "login.html";
    });

    li.appendChild(a);
    return li;
  }

  /* ===== ADMIN ===== */
  if (user && user.role === "admin") {
    list.appendChild(navItem("dashboard.html", "Dashboard"));
    list.appendChild(navItem("job-manage.html", "My Jobs"));
    list.appendChild(navItem("job-create.html", "Add Job"));
    list.appendChild(navItem("profile.html", "Profile"));

    var chipLi = document.createElement("li");
    var chip = document.createElement("div");
    chip.className = "nav-user-chip";

    var av = document.createElement("div");
    av.className = "nav-user-avatar";
    av.textContent = (user.name || "A")[0].toUpperCase();

    chip.appendChild(av);
    chip.appendChild(document.createTextNode(user.name || "Admin"));
    chipLi.appendChild(chip);
    list.appendChild(chipLi);

    list.appendChild(logoutItem());

    /* ===== USER ===== */
  } else if (user) {
    list.appendChild(navItem("index.html", "Home"));
    list.appendChild(navItem("jobs.html", "Jobs"));
    list.appendChild(navItem("search.html", "Search"));
    list.appendChild(navItem("applications.html", "My Applications"));
    list.appendChild(navItem("profile.html", "Profile"));

    var chipLi2 = document.createElement("li");
    var chip2 = document.createElement("div");
    chip2.className = "nav-user-chip";

    var av2 = document.createElement("div");
    av2.className = "nav-user-avatar";
    av2.textContent = (user.name || "U")[0].toUpperCase();

    chip2.appendChild(av2);
    chip2.appendChild(document.createTextNode(user.name || "User"));
    chipLi2.appendChild(chip2);
    list.appendChild(chipLi2);

    list.appendChild(logoutItem());

    /* ===== GUEST ===== */
  } else {
    list.appendChild(navItem("login.html", "Login"));
    list.appendChild(navItem("register.html", "Register"));
  }
});



