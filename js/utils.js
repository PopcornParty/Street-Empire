export const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const uid = () => Math.random().toString(36).slice(2, 10);
export const now = () => Date.now();

export function formatMoney(n) {
  const v = Math.floor(Number(n) || 0);
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e4) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toLocaleString()}`;
}

export function formatNum(n) {
  const v = Math.floor(Number(n) || 0);
  if (Math.abs(v) >= 1e6) return formatMoney(v).replace("$", "");
  return v.toLocaleString();
}

export function hoursToMs(h) { return h * 3600 * 1000; }
export function seconds(n) { return n * 1000; }

export function deepClone(o) {
  return JSON.parse(JSON.stringify(o));
}

export function animateValue(el, from, to, ms, fmt = formatMoney) {
  if (!el) return;
  const start = performance.now();
  const tick = (t) => {
    const p = Math.min(1, (t - start) / ms);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(from + (to - from) * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function haptic(ms = 12) {
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch {}
}

export function qs(sel, root = document) { return root.querySelector(sel); }
export function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }

export function downloadText(filename, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export const FIRST_NAMES = ["Alex","Jordan","Sam","Taylor","Riley","Casey","Quinn","Morgan","Avery","Jamie","Drew","Parker","Reese","Skyler","Cameron","Hayden","Rowan","Finley","Sage","Eden"];
export const LAST_NAMES = ["Cole","Hayes","Brooks","Lane","West","North","Vale","Stone","Park","Reed","Frost","Quinn","Blair","Shaw","Hart"];

export function randomName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}
