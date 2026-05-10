/* Load data */
var jobs = JobStorage.getAllJobs();
var applied = JobStorage.getAppliedJobs();

/* Update stats */
document.getElementById("stat-jobs").textContent = jobs.length;
document.getElementById("stat-applied").textContent = applied.length;

/* Show recent jobs */
var container = document.getElementById("recent-jobs");
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

    card.innerHTML =
      '<div class="job-preview-info">' +
      "<h3>" +
      job.title +
      "</h3>" +
      "<p>" +
      job.company +
      " &nbsp;·&nbsp; $" +
      Number(job.salary).toLocaleString() +
      "/mo &nbsp;·&nbsp; " +
      job.years +
      "+ yrs</p>" +
      "</div>" +
      '<span class="badge badge-' +
      job.status +
      '">' +
      (job.status === "open" ? "● Open" : "● Closed") +
      "</span>";

    card.style.cursor = "pointer";

    card.addEventListener("click", function () {
      JobStorage.selectJob(job);
    });

    container.appendChild(card);
  });
}



