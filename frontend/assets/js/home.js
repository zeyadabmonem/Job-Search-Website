var container = document.getElementById("recent-jobs");

/* Fetch jobs from backend */
fetch('http://127.0.0.1:8000/api/jobs/')
  .then(res => res.json())
  .then(jobs => {
    document.getElementById("stat-jobs").textContent = jobs.length;
    var recent = jobs.slice(-3).reverse();

    if (recent.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
        '<div class="empty-state-icon"></div>' +
        "<p>No jobs posted yet.</p>" +
        "</div>";
    } else {
      recent.forEach(function (job) {
        var card = document.createElement("div");
        card.className = "job-preview-card";

        var statusClass = job.status ? job.status.toLowerCase() : 'open';
        var statusLabel = statusClass === 'open' ? '● Open' : '● Closed';

        card.innerHTML =
          '<div class="job-preview-info">' +
          "<h3>" + job.title + "</h3>" +
          "<p>" + job.company + " &nbsp;·&nbsp; $" + Number(job.salary).toLocaleString() +
          "/mo &nbsp;·&nbsp; " + job.years + "+ yrs</p>" +
          "</div>" +
          '<span class="badge badge-' + statusClass + '">' + statusLabel + "</span>";

        card.style.cursor = "pointer";

        card.addEventListener("click", function () {
          window.location.href = 'job-details.html?id=' + job.id;
        });

        container.appendChild(card);
      });
    }
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = '<div class="empty-state"><p>Error loading jobs.</p></div>';
  });

/* Update applied stat if logged in as seeker */
var token = JobStorage.getToken();
var user = JobStorage.getUser();
if (token && user && user.role === 'seeker') {
  fetch('http://127.0.0.1:8000/api/my-applications/', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(apps => {
    document.getElementById("stat-applied").textContent = apps.length;
  })
  .catch(err => console.error(err));
} else {
  document.getElementById("stat-applied").textContent = '0';
}



