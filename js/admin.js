import {
  BUSINESSES, PROPERTIES, VEHICLES, EMPLOYEE_ROLES, DISTRICTS,
  MISSIONS, ACHIEVEMENTS, HQ_STAGES, CAR_COLORS
} from "./data.js";
import { getState, patch, emptyBusinessState, logActivity } from "./state.js";
import { resetGame, saveGame } from "./save.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";
import { formatMoney, pick, randomName, uid } from "./utils.js";
import { scanAchievements } from "./achievements.js";
import { syncRankTracker } from "./progression.js";

const CODE = "FERRARI1";
let buffer = "";

export function bindAdminCode() {
  window.SE_tryAdminCode = tryAdminCode;
  document.addEventListener("keydown", (e) => {
    if ((e.target.tagName || "") === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (!e.key || e.key.length !== 1) return;
    buffer = (buffer + e.key.toUpperCase()).slice(-CODE.length);
    if (buffer === CODE) { buffer = ""; openAdmin(); }
  });
}

export function tryAdminCode(value) {
  if (String(value || "").trim().toUpperCase() === CODE) { openAdmin(); return true; }
  notify("That code does nothing.");
  return false;
}

async function uiApi() { return import("./ui.js"); }

export function openAdmin() {
  sfx("unlock");
  notify("Admin console online.", "FERRARI1");
  draw();
}

function closeAdmin() {
  const el = document.getElementById("admin-host");
  if (el) el.innerHTML = "";
}

function draw() {
  let host = document.getElementById("admin-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "admin-host";
    document.body.appendChild(host);
  }
  const s = getState();
  host.innerHTML = `<div class="admin-mask"><div class="admin-panel">
    <div class="admin-head"><div><div class="tiny">SECRET CONSOLE</div><h3>FERRARI1 ADMIN</h3></div>
    <button class="btn" type="button" id="ad-close">Close</button></div>
    <div class="admin-kpis"><span>Cash ${formatMoney(s.cash)}</span><span>XP ${s.xp}</span><span>Rep ${s.reputation}</span></div>
    <div class="admin-grid">
      <button class="btn" data-cash="100000">+$100K</button>
      <button class="btn" data-cash="1000000">+$1M</button>
      <button class="btn" data-cash="100000000">+$100M</button>
      <button class="btn" data-ad="xp">+500 XP</button>
      <button class="btn" data-ad="districts">Unlock districts</button>
      <button class="btn" data-ad="biz">Own all businesses</button>
      <button class="btn" data-ad="skip">Skip tutorial</button>
      <button class="btn danger" data-ad="reset">Reset progress</button>
    </div></div></div>`;
  host.querySelector("#ad-close").onclick = closeAdmin;
  host.querySelectorAll("[data-cash]").forEach((b) => b.onclick = () => {
    patch((st) => { st.cash += Number(b.dataset.cash); st.stats.earned += Number(b.dataset.cash); });
    saveGame(true); notify("Cash added", "ADMIN"); draw();
  });
  host.querySelectorAll("[data-ad]").forEach((b) => b.onclick = () => run(b.dataset.ad));
}

async function run(act) {
  if (act === "xp") patch((s) => { s.xp += 500; });
  if (act === "skip") {
    patch((s) => { s.tutorialDone = true; });
    const t = document.getElementById("tutorial-host");
    if (t) t.innerHTML = "";
  }
  if (act === "districts") patch((s) => { s.unlockedDistricts = DISTRICTS.map((d) => d.id); s.reputation = Math.max(s.reputation, 600); });
  if (act === "biz") patch((s) => {
    s.unlockedDistricts = DISTRICTS.map((d) => d.id);
    for (const b of BUSINESSES) if (!s.businesses[b.id]) s.businesses[b.id] = emptyBusinessState(b.id);
  });
  if (act === "reset") {
    if (confirm("Delete local save?")) { resetGame(); closeAdmin(); location.reload(); }
    return;
  }
  saveGame(true);
  scanAchievements();
  syncRankTracker();
  const u = await uiApi();
  u.render();
  draw();
  notify("Admin action done", "ADMIN");
}
