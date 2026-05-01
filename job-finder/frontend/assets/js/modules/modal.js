export function openModal({ title, message, confirmText = "Close", onConfirm }) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  backdrop.innerHTML = `
    <div class="modal">
      <h2>${title}</h2>
      <p class="muted">${message}</p>
      <div class="modal-actions">
        <button id="modal-confirm" class="btn btn-primary" type="button">${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
  });

  backdrop.querySelector("#modal-confirm").addEventListener("click", () => {
    if (typeof onConfirm === "function") onConfirm();
    close();
  });
}
