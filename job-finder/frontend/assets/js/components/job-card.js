import { formatDate } from "../utils/formatters.js";

export function renderJobCard(job, actionLabel = "View details") {
  return `
    <article class="card stack-sm">
      <h3>${job.title}</h3>
      <p class="muted">${job.company} - ${job.location}</p>
      <p class="muted">Posted ${formatDate(job.postedAt)}</p>
      <p><span class="badge">${job.type}</span> <span class="badge">${job.salary}</span></p>
      <p>${job.summary}</p>
      <a class="btn btn-outline" href="job-details.html?id=${job.id}">${actionLabel}</a>
    </article>
  `;
}
