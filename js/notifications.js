const log = [];

export function notify(message, title = "") {
  log.unshift({ t: Date.now(), title, message });
  if (log.length > 40) log.length = 40;
  pushDom(message, title);
}

function pushDom(message, title) {
  const host = document.getElementById("toast-host");
  if (!host) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `${title ? `<strong>${esc(title)}</strong><br>` : ""}${esc(message)}`;
  host.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

export function recentNotifications() {
  return log;
}
