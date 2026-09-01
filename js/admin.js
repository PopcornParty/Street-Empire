import { BUSINESSES, DISTRICTS } from "./data.js";
import { getState, patch, emptyBusinessState } from "./state.js";
import { resetGame, saveGame } from "./save.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";
import { formatMoney } from "./utils.js";
import { scanAchievements } from "./achievements.js";
import { syncRankTracker } from "./progression.js";

const CODE = "FERRARI1";
let buffer = "";

export function bindAdminCode() {
  window.SE_tryAdminCode = tryAdminCode;
  window.SE_openAdmin = openAdmin;
  document.addEventListener("keydown", (e) => {
    if ((e.target.tagName || "") === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (!e.key || e.key.length !== 1) return;
    buffer = (buffer + e.key.toUpperCase()).slice(-CODE.length);
    if (buffer === CODE) { buffer = ""; openAdmin(); }
  });
}

export function tryAdminCode(value) {
  if (String(value || "").trim().toUpperCase() === CODE) {
    const active = document.activeElement;
    if (active && active.blur) active.blur();
    setTimeout(openAdmin, 180);
    return true;
  }
  notify("That code does nothing.");
  return false;
}

async function uiApi() { return import("./ui.js"); }

export function openAdmin() {
  document.body.classList.add("admin-open");
  sfx("unlock");
  notify("Admin console online.", "FERRARI1");
  draw();
}

function closeAdmin() {
  document.body.classList.remove("admin-open");
  const el = document.getElementById("admin-host");
  if (el) {
    el.innerHTML = "";
    el.setAttribute("style", "display:none");
  }
}

function pinHost(host) {
  const vv = window.visualViewport;
  const top = vv ? Math.round(vv.offsetTop) : 0;
  const left = vv ? Math.round(vv.offsetLeft) : 0;
  const width = vv ? Math.round(vv.width) : window.innerWidth;
  const height = vv ? Math.round(vv.height) : window.innerHeight;
  host.setAttribute("style", [
    "display:block",
    "position:fixed",
    "z-index:2147483646",
    `top:${top}px`,
    `left:${left}px`,
    `width:${width}px`,
    `height:${height}px`,
    "margin:0",
    "padding:0",
    "overflow:hidden",
    "pointer-events:auto"
  ].join(";"));
}

function draw() {
  let host = document.getElementById("admin-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "admin-host";
  }
  if (host.parentElement !== document.body) document.body.appendChild(host);
  pinHost(host);
  const s = getState();
  host.innerHTML = `
    <div style="position:absolute;inset:0;background:#070b16;color:#eef3ff;display:flex;flex-direction:column;font-family:system-ui,sans-serif;">
      <div style="flex:0 0 auto;display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid #f5c14a55;background:#101428;">
        <div>
          <div style="font-size:11px;color:#8b97b8;letter-spacing:.8px;">SECRET CONSOLE</div>
          <h3 style="margin:0;color:#f5c14a;">FERRARI1 ADMIN</h3>
        </div>
        <button class="btn" type="button" id="ad-close" style="min-height:44px;padding:8px 14px;border-radius:12px;background:#f5c14a;color:#1a1204;border:0;font-weight:700;">Close</button>
      </div>
      <div style="flex:1 1 auto;overflow:auto;-webkit-overflow-scrolling:touch;padding:14px;">
        <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:12px;color:#f5c14a;margin-bottom:12px;">
          <span>Cash ${formatMoney(s.cash)}</span>
          <span>XP ${s.xp}</span>
          <span>Rep ${s.reputation}</span>
        </div>
        <div class="admin-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <button class="btn" data-cash="100000" type="button">+$100K</button>
          <button class="btn" data-cash="1000000" type="button">+$1M</button>
          <button class="btn" data-cash="100000000" type="button">+$100M</button>
          <button class="btn" data-ad="xp" type="button">+500 XP</button>
          <button class="btn" data-ad="districts" type="button">Unlock districts</button>
          <button class="btn" data-ad="biz" type="button">Own all businesses</button>
          <button class="btn" data-ad="skip" type="button">Skip tutorial</button>
          <button class="btn danger" data-ad="reset" type="button">Reset progress</button>
        </div>
      </div>
    </div>`;
  host.querySelector("#ad-close").onclick = closeAdmin;
  host.querySelectorAll("[data-cash]").forEach((b) => {
    b.onclick = () => {
      patch((st) => { st.cash += Number(b.dataset.cash); st.stats.earned += Number(b.dataset.cash); });
      saveGame(true); notify("Cash added", "ADMIN"); draw();
    };
  });
  host.querySelectorAll("[data-ad]").forEach((b) => { b.onclick = () => run(b.dataset.ad); });
}

async function run(act) {
  if (act === "xp") patch((s) => { s.xp += 500; });
  if (act === "skip") {
    patch((s) => { s.tutorialDone = true; });
    const t = document.getElementById("tutorial-host");
    if (t) t.innerHTML = "";
  }
  if (act === "districts") patch((s) => {
    s.unlockedDistricts = DISTRICTS.map((d) => d.id);
    s.reputation = Math.max(s.reputation, 600);
  });
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
