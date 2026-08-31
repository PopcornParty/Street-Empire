import {
  BUSINESSES, PROPERTIES, VEHICLES, EMPLOYEE_ROLES, DISTRICTS, MISSIONS,
  ACHIEVEMENTS, CONTRACTS, DAILY, HQ_STAGES, UPGRADE_CATS, CAR_COLORS, AVATARS
} from "./data.js";
import { getState, patch } from "./state.js";
import { formatMoney, formatNum, haptic, downloadText, qs } from "./utils.js";
import { totalIncome, netWorth, empireLevel, xpToNext, slotCap, businessRates, upgradeCost, catCost, propertyRent } from "./economy.js";
import { buyBusiness, upgradeBusiness, upgradeCategory, collectBusiness, collectAll, canBuyBusiness } from "./businesses.js";
import { buyProperty, upgradeProperty, sellProperty, propDef } from "./properties.js";
import { hireEmployee, assignEmployee, trainEmployee, fireEmployee, hireCost } from "./employees.js";
import { buyVehicle, setActiveVehicle, recolorVehicle, upgradeVehicle, vehDef } from "./vehicles.js";
import { unlockDistrict, canUnlockDistrict } from "./districts.js";
import { missionProgress, claimMission } from "./missions.js";
import { achProgress } from "./achievements.js";
import { availableContracts, startContract } from "./contracts.js";
import { currentEvent } from "./events.js";
import { claimDaily, canClaimDaily, upgradeHQ } from "./progression.js";
import { LeaderboardService } from "./leaderboard.js";
import { exportSave, importSave, resetGame, saveGame } from "./save.js";
import { sfx } from "./audio.js";
import { DISTRICT_LAYOUT, holdingsInDistrict, districtDevClass, plotsForDistrict } from "./city.js";
import { notify } from "./notifications.js";

const NAV = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "city", icon: "🏙️", label: "City" },
  { id: "biz", icon: "🏢", label: "Biz" },
  { id: "shop", icon: "🛒", label: "Shop" },
  { id: "more", icon: "☰", label: "More" }
];
const MORE = [
  { id: "props", icon: "🏠", label: "Properties" },
  { id: "garage", icon: "🚗", label: "Garage" },
  { id: "staff", icon: "👥", label: "Staff" },
  { id: "missions", icon: "🎯", label: "Missions" },
  { id: "achievements", icon: "🏆", label: "Achievements" },
  { id: "contracts", icon: "📝", label: "Contracts" },
  { id: "stats", icon: "📊", label: "Stats" },
  { id: "board", icon: "🥇", label: "Leaderboard" },
  { id: "settings", icon: "⚙️", label: "Settings" }
];
let screen = "home";
let shopTab = "biz";
export function currentScreen() { return screen; }
export function markDirty() {}
export function go(id) { screen = id; sfx("click"); haptic(8); render(); }
export function bindChrome() {
  const side = qs("#side-nav"); const bottom = qs("#bottom-nav");
  const items = [...NAV, ...MORE.filter((m) => ["props", "staff", "missions", "settings"].includes(m.id))];
  const html = (n) => `<button class="nav-btn ${screen === n.id ? "active" : ""}" data-nav="${n.id}" type="button"><span class="ico">${n.icon}</span>${n.label}</button>`;
  if (side) side.innerHTML = items.map(html).join("");
  if (bottom) bottom.innerHTML = NAV.map(html).join("");
  const onNav = (e) => { const b = e.target.closest("[data-nav]"); if (!b) return; if (b.dataset.nav === "more") openMore(); else go(b.dataset.nav); };
  if (side) side.onclick = onNav; if (bottom) bottom.onclick = onNav;
}
function openMore() {
  sheet(`<h3>Menu</h3><div class="list">${MORE.map((m) => `<button class="btn block" data-go="${m.id}" type="button">${m.icon} ${m.label}</button>`).join("")}</div>`, (root) => {
    root.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => { closeSheet(); go(b.dataset.go); });
  });
}
export function renderTop() {
  const s = getState(); if (!s) return;
  const inc = totalIncome(s);
  const cash = qs("#cash-display"); const incEl = qs("#income-display"); const title = qs("#empire-title");
  if (cash) cash.textContent = formatMoney(s.cash);
  if (incEl) incEl.textContent = formatMoney(inc.profit);
  if (title) title.textContent = empireLevel(s.xp).name;
  document.querySelectorAll(".nav-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.nav === screen || (!["home","city","biz","shop"].includes(screen) && b.dataset.nav === "more"));
  });
}
export function render() {
  const host = qs("#screen-host"); const s = getState(); if (!host || !s) return;
  host.dataset.booted = "1"; applyTheme(s.settings.theme); renderTop();
  const map = { home: viewHome, city: viewCity, biz: viewBiz, shop: viewShop, props: viewProps, garage: viewGarage, staff: viewStaff, missions: viewMissions, achievements: viewAchs, contracts: viewContracts, stats: viewStats, board: viewBoard, settings: viewSettings };
  try { host.innerHTML = (map[screen] || viewHome)(s); wireScreen(host, s); }
  catch (err) { console.error(err); host.innerHTML = `<section class="card section"><h2 class="h2">Screen error</h2><p class="tiny">${String(err.message || err)}</p></section>`; }
}
function applyTheme(theme) {
  let t = theme; if (theme === "system") t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  document.body.dataset.theme = t;
}
function viewHome(s) {
  const inc = totalIncome(s); const xp = xpToNext(s); const ev = currentEvent(s);
  const nextM = MISSIONS.find((m) => !s.missionsDone.includes(m.id));
  const mp = nextM ? missionProgress(nextM, s) : null;
  const stored = Object.values(s.businesses).reduce((n, b) => n + b.stored, 0);
  const hq = HQ_STAGES[s.hq] || HQ_STAGES[0];
  return `<section class="dash-hero"><div class="tiny">WELCOME BACK</div><h1 class="h1">${s.avatar} ${s.username}</h1>
    <div class="row"><span>Lv ${xp.rank.level} · ${xp.rank.name}</span><span class="tiny">${formatNum(s.xp)} XP</span></div>
    <div class="progress"><i style="width:${Math.round(xp.pct * 100)}%"></i></div></section>
    <section class="grid-2 section">
      <div class="kpi"><span>CASH</span><b>${formatMoney(s.cash)}</b></div>
      <div class="kpi"><span>NET WORTH</span><b>${formatMoney(netWorth(s))}</b></div>
      <div class="kpi"><span>PROFIT / HR</span><b>${formatMoney(inc.profit)}</b></div>
      <div class="kpi"><span>BIZ</span><b>${Object.keys(s.businesses).length}/${slotCap(s)}</b></div>
    </section>
    ${ev ? `<div class="card section"><b>${ev.name}</b><div class="tiny">${ev.desc}</div></div>` : ""}
    <div class="quick">
      <button class="btn cyan" data-act="collect" type="button">Collect ${stored > 1 ? formatMoney(stored) : ""}</button>
      <button class="btn primary" data-go="city" type="button">City Map</button>
      <button class="btn" data-go="shop" type="button">Shop</button>
      <button class="btn" data-go="missions" type="button">Missions</button>
    </div>
    ${nextM ? `<div class="card section"><div class="tiny">CURRENT OBJECTIVE</div><b>${nextM.name}</b><div class="tiny">${nextM.desc}</div>
      <div class="progress" style="margin-top:8px"><i style="width:${Math.min(100, Math.round((mp.have / Math.max(1, mp.need)) * 100))}%"></i></div>
      ${mp.done ? `<button class="btn primary block" data-claim="${nextM.id}" type="button">Claim</button>` : ""}</div>` : ""}
    <div class="card section"><div class="h2">Headquarters</div><div class="hq-art">${hq.icon}</div><b>${hq.name}</b>
      ${HQ_STAGES[s.hq + 1] ? `<button class="btn primary block" data-act="hq" type="button">Upgrade to ${HQ_STAGES[s.hq + 1].name} · ${formatMoney(HQ_STAGES[s.hq + 1].cost)}</button>` : "<div class='tiny'>Max HQ reached.</div>"}</div>
    <div class="card section"><div class="h2">Daily Reward</div>
      <div class="daily-row">${DAILY.map((d, i) => `<div class="day-box ${i === (s.daily.dayIndex % 7) ? "today" : ""}">D${d.day}</div>`).join("")}</div>
      <button class="btn cyan block" style="margin-top:10px" data-act="daily" type="button">${canClaimDaily() ? "Claim today" : "Come back tomorrow"}</button></div>
    <div class="card"><div class="h2">Recent activity</div>${(s.activity || []).slice(0, 6).map((a) => `<div class="activity">${a}</div>`).join("")}</div>`;
}
function viewCity(s) {
  return `<div class="city-wrap"><div class="row"><h2 class="h2">Aurelia City</h2><span class="pill gold">${s.unlockedDistricts.length}/10 districts</span></div>
    <div class="city-map" id="city-map"><div class="city-scroll">${DISTRICTS.map((d) => districtTile(d, s)).join("")}</div></div>
    <div class="map-legend"><span>Tap a plot to buy or manage</span></div></div>`;
}
function districtTile(d, s) {
  const open = s.unlockedDistricts.includes(d.id);
  const lay = DISTRICT_LAYOUT[d.id] || { x: 40, y: 80, w: 220, h: 160 };
  const plots = plotsForDistrict(d.id);
  return `<div class="district ${open ? "" : "locked"} ${districtDevClass(d.id, s)}" data-district="${d.id}" style="left:${lay.x}px;top:${lay.y}px;width:${lay.w}px;height:${lay.h}px;border-color:${d.color}55">
    <h4>${d.name} ${open ? "" : "🔒"}</h4>
    <div class="plots">${plots.slice(0, 6).map((b) => {
      const inst = s.businesses[b.id];
      const cls = !open ? "locked-plot" : inst ? "owned" : "empty";
      return `<button class="plot ${cls}" data-plot="${b.id}" type="button">${inst ? b.icon : open ? "+" : "·"}</button>`;
    }).join("")}</div></div>`;
}
function viewBiz(s) {
  const list = Object.values(s.businesses);
  if (!list.length) return `<div class="card"><h2 class="h2">No businesses yet</h2><button class="btn primary" data-go="shop" type="button">Open shop</button></div>`;
  return `<div class="row section"><h2 class="h2">Businesses</h2><button class="btn cyan" data-act="collect" type="button">Collect all</button></div>
    <div class="list">${list.map((inst) => bizCard(s, inst)).join("")}</div>`;
}
function bizCard(s, inst) {
  const def = BUSINESSES.find((b) => b.id === inst.id); if (!def) return "";
  const r = businessRates(s, inst); const cost = upgradeCost(def.price, inst.level);
  return `<article class="card biz-card"><div class="icon-tile">${def.icon}</div><div>
    <div class="row"><b>${def.name}</b><span class="pill">Lv ${inst.level}/${def.maxLevel}</span></div>
    <div class="tiny">${formatMoney(r.profit)}/hr · stored ${formatMoney(inst.stored)}</div>
    <div class="row" style="margin-top:8px"><button class="btn" data-manage="${def.id}" type="button">Manage</button>
      <button class="btn" data-col="${def.id}" type="button">Collect</button>
      <button class="btn primary" data-up="${def.id}" type="button">${inst.level >= def.maxLevel ? "Max" : formatMoney(cost)}</button></div></div></article>`;
}
function viewShop(s) {
  const tabs = [["biz", "Businesses"], ["props", "Properties"], ["veh", "Vehicles"]];
  return `<div class="tabs">${tabs.map(([id, lab]) => `<button class="tab ${shopTab === id ? "on" : ""}" data-stab="${id}" type="button">${lab}</button>`).join("")}</div>
    <div class="list">${shopTab === "biz" ? shopBiz(s) : shopTab === "props" ? shopProps(s) : shopVeh(s)}</div>`;
}
function shopBiz(s) {
  return BUSINESSES.map((b) => {
    const owned = !!s.businesses[b.id]; const gate = owned ? { ok: false } : canBuyBusiness(b.id);
    const open = s.unlockedDistricts.includes(b.district); const d = DISTRICTS.find((x) => x.id === b.district);
    return `<article class="card shop-card ${owned || !open ? "locked" : ""}"><div class="icon-tile">${b.icon}</div><div>
      <div class="row"><b>${b.name}</b><span class="pill">T${b.tier}</span></div>
      <div class="tiny">${formatMoney(b.income)}/hr · ${d ? d.name : b.district}</div>
      <div class="row" style="margin-top:6px"><span class="price">${formatMoney(b.price)}</span>
        <button class="btn primary" data-buybiz="${b.id}" ${gate.ok ? "" : "disabled"} type="button">${owned ? "Owned" : !open ? "Locked" : "Buy"}</button></div></div></article>`;
  }).join("");
}
function shopProps(s) {
  return PROPERTIES.map((p) => {
    const owned = !!s.properties[p.id]; const open = s.unlockedDistricts.includes(p.district);
    const ok = !owned && open && s.cash >= p.price && s.reputation >= p.repReq;
    return `<article class="card ${owned || !open ? "locked" : ""}"><div class="row"><b>${p.icon} ${p.name}</b><span class="price">${formatMoney(p.price)}</span></div>
      <div class="tiny">Rent ${formatMoney(p.rent)}/hr</div>
      <button class="btn primary block" data-buyprop="${p.id}" ${ok ? "" : "disabled"} type="button">${owned ? "Owned" : "Buy"}</button></article>`;
  }).join("");
}
function shopVeh(s) {
  return VEHICLES.map((v) => {
    const owned = !!s.vehicles[v.id];
    return `<article class="card"><div class="row"><b>${v.icon} ${v.name}</b>
      <button class="btn primary" data-buyveh="${v.id}" ${owned || s.cash < v.price ? "disabled" : ""} type="button">${owned ? "Owned" : formatMoney(v.price)}</button></div></article>`;
  }).join("");
}
function viewProps(s) {
  const ids = Object.keys(s.properties);
  if (!ids.length) return `<div class="card"><p>No properties yet.</p><button class="btn primary" data-go="shop" type="button">Shop</button></div>`;
  return `<h2 class="h2">Property desk</h2><div class="list">${ids.map((id) => {
    const p = s.properties[id]; const def = propDef(id);
    return `<article class="card"><div class="row"><b>${def.icon} ${def.name}</b><span class="pill">Lv ${p.level}</span></div>
      <div class="tiny">${formatMoney(propertyRent(def, p.level))}/hr rent</div>
      <div class="row" style="margin-top:8px"><button class="btn primary" data-upprop="${id}" type="button">Renovate</button>
      <button class="btn danger" data-sellprop="${id}" type="button">Sell</button></div></article>`;
  }).join("")}</div>`;
}
function viewGarage(s) {
  const ids = Object.keys(s.vehicles);
  if (!ids.length) return `<div class="card"><p>Garage is empty.</p><button class="btn primary" data-go="shop" type="button">Buy a vehicle</button></div>`;
  return `<h2 class="h2">Garage</h2><div class="list">${ids.map((id) => {
    const v = s.vehicles[id]; const def = vehDef(id);
    return `<article class="card"><div class="row"><b>${def.icon} ${def.name}</b><span class="tiny">${s.activeVehicle === id ? "Active" : "Parked"}</span></div>
      <div class="row"><button class="btn" data-active="${id}" type="button">Set active</button>
      <button class="btn primary" data-upveh="${id}" type="button">${v.upgraded ? "Tuned" : "Tune"}</button></div></article>`;
  }).join("")}</div>`;
}
function viewStaff(s) {
  return `<h2 class="h2">Hiring desk</h2><div class="list section">${EMPLOYEE_ROLES.map((r) => `<article class="card row"><div><b>${r.icon} ${r.name}</b></div>
      <button class="btn primary" data-hire="${r.id}" type="button">${formatMoney(hireCost(r))}</button></article>`).join("")}</div>
    <h2 class="h2">Team</h2><div class="list">${s.employees.length ? s.employees.map((e) => `<article class="card"><div class="row"><b>${e.icon} ${e.name}</b><span class="pill">Lv ${e.level}</span></div>
      <div class="row" style="margin-top:8px"><button class="btn" data-assign="${e.id}" type="button">Assign</button>
      <button class="btn" data-train="${e.id}" type="button">Train</button>
      <button class="btn danger" data-fire="${e.id}" type="button">Release</button></div></article>`).join("") : "<div class='muted'>No staff hired yet.</div>"}</div>`;
}
function viewMissions(s) {
  const open = MISSIONS.filter((m) => !s.missionsDone.includes(m.id)).slice(0, 12);
  return `<div class="row"><h2 class="h2">Missions</h2><span class="pill">${s.missionsDone.length}/${MISSIONS.length}</span></div>
    <div class="list">${open.map((m) => { const p = missionProgress(m, s);
      return `<article class="card"><b>${m.name}</b><div class="tiny">${m.desc}</div>
        <div class="progress" style="margin:8px 0"><i style="width:${Math.min(100, Math.round((p.have / Math.max(1, p.need)) * 100))}%"></i></div>
        <div class="row"><span class="tiny">${formatNum(Math.min(p.have, p.need))} / ${formatNum(p.need)}</span>
        <button class="btn primary" data-claim="${m.id}" ${p.done ? "" : "disabled"} type="button">Claim ${formatMoney(m.cash)}</button></div></article>`; }).join("")}</div>`;
}
function viewAchs(s) {
  return `<div class="row"><h2 class="h2">Achievements</h2><span class="pill">${s.achievements.length}/${ACHIEVEMENTS.length}</span></div>
    <div class="ach-grid">${ACHIEVEMENTS.map((a) => { const on = s.achievements.includes(a.id); const p = achProgress(a, s);
      return `<div class="ach ${on ? "on" : ""}"><div>${a.icon}</div><b>${a.name}</b><div class="tiny">${on ? "Unlocked" : `${formatNum(Math.min(p.have, p.need))} / ${formatNum(p.need)}`}</div></div>`; }).join("")}</div>`;
}
function viewContracts(s) {
  const avail = availableContracts(s);
  return `<h2 class="h2">Contracts</h2><div class="list">${avail.map((c) => `<article class="card"><b>${c.name}</b><div class="tiny">${c.desc}</div>
      <div class="row" style="margin-top:8px"><span class="price">${formatMoney(c.reward)}</span>
      <button class="btn primary" data-contract="${c.id}" type="button">Accept</button></div></article>`).join("") || "<div class='muted'>Own matching businesses to unlock contracts.</div>"}</div>`;
}
function viewStats(s) {
  const inc = totalIncome(s);
  const rows = [["Cash", formatMoney(s.cash)], ["Net worth", formatMoney(netWorth(s))], ["Net / hr", formatMoney(inc.profit)], ["Reputation", formatNum(s.reputation)]];
  return `<h2 class="h2">Empire stats</h2><div class="card">${rows.map((r) => `<div class="row activity"><span>${r[0]}</span><b>${r[1]}</b></div>`).join("")}</div>`;
}
function viewBoard() { return `<h2 class="h2">Leaderboard</h2><div class="card" id="board-body">Loading…</div>`; }
function viewSettings(s) {
  return `<h2 class="h2">Settings</h2><div class="card">
    <div class="field"><label>Display name</label><input class="text-in" id="name-in" value="${s.username}" maxlength="18" /></div>
    <div class="field"><label>Access code</label><input class="text-in" id="code-in" placeholder="Type a code" autocomplete="off" />
      <button class="btn block" style="margin-top:8px" data-act="code" type="button">Submit code</button></div>
    <button class="btn block" data-act="export" type="button">Export save</button>
    <button class="btn block" data-act="import" type="button">Import save</button>
    <button class="btn danger block" data-act="reset" type="button">Reset save</button></div>`;
}
function wireScreen(host, s) {
  host.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => go(b.dataset.go));
  host.querySelectorAll("[data-act]").forEach((b) => b.onclick = () => act(b.dataset.act));
  host.querySelectorAll("[data-buybiz]").forEach((b) => b.onclick = () => { if (buyBusiness(b.dataset.buybiz)) render(); });
  host.querySelectorAll("[data-buyprop]").forEach((b) => b.onclick = () => { if (buyProperty(b.dataset.buyprop)) render(); });
  host.querySelectorAll("[data-buyveh]").forEach((b) => b.onclick = () => { if (buyVehicle(b.dataset.buyveh)) render(); });
  host.querySelectorAll("[data-up]").forEach((b) => b.onclick = () => { if (upgradeBusiness(b.dataset.up)) render(); });
  host.querySelectorAll("[data-col]").forEach((b) => b.onclick = () => { collectBusiness(b.dataset.col); render(); });
  host.querySelectorAll("[data-manage]").forEach((b) => b.onclick = () => openManage(b.dataset.manage));
  host.querySelectorAll("[data-plot]").forEach((b) => b.onclick = () => onPlot(b.dataset.plot));
  host.querySelectorAll("[data-district]").forEach((el) => el.addEventListener("click", (e) => { if (e.target.closest("[data-plot]")) return; onDistrict(el.dataset.district); }));
  host.querySelectorAll("[data-stab]").forEach((b) => b.onclick = () => { shopTab = b.dataset.stab; render(); });
  host.querySelectorAll("[data-claim]").forEach((b) => b.onclick = () => { claimMission(b.dataset.claim); render(); });
  host.querySelectorAll("[data-hire]").forEach((b) => b.onclick = () => { hireEmployee(b.dataset.hire); render(); });
  host.querySelectorAll("[data-train]").forEach((b) => b.onclick = () => { trainEmployee(b.dataset.train); render(); });
  host.querySelectorAll("[data-fire]").forEach((b) => b.onclick = () => { fireEmployee(b.dataset.fire); render(); });
  host.querySelectorAll("[data-assign]").forEach((b) => b.onclick = () => openAssign(b.dataset.assign));
  host.querySelectorAll("[data-upprop]").forEach((b) => b.onclick = () => { upgradeProperty(b.dataset.upprop); render(); });
  host.querySelectorAll("[data-sellprop]").forEach((b) => b.onclick = () => { sellProperty(b.dataset.sellprop); render(); });
  host.querySelectorAll("[data-active]").forEach((b) => b.onclick = () => { setActiveVehicle(b.dataset.active); render(); });
  host.querySelectorAll("[data-upveh]").forEach((b) => b.onclick = () => { upgradeVehicle(b.dataset.upveh); render(); });
  host.querySelectorAll("[data-contract]").forEach((b) => b.onclick = () => { startContract(b.dataset.contract); render(); });
  if (screen === "board") {
    LeaderboardService.fetchBoard().then((res) => {
      const box = document.getElementById("board-body");
      if (box) box.innerHTML = res.rows.map((r) => `<div class="lb-row ${r.you ? "you" : ""}"><span>${r.rank}</span><span>${r.name}</span><b>${formatMoney(r.worth)}</b></div>`).join("");
    }).catch(() => {});
  }
  if (screen === "settings") {
    const name = host.querySelector("#name-in");
    if (name) name.onchange = () => patch((st) => { st.username = name.value.slice(0, 18) || "Founder"; });
  }
}
function act(kind) {
  if (kind === "collect") collectAll();
  if (kind === "daily") claimDaily();
  if (kind === "hq") upgradeHQ();
  if (kind === "export") { downloadText("street-empire-save.json", exportSave()); notify("Save exported."); }
  if (kind === "import") { const raw = prompt("Paste save JSON"); if (raw) { try { importSave(raw); notify("Save imported."); } catch { notify("Invalid save file."); } } }
  if (kind === "reset") { if (confirm("Delete your local save?")) { resetGame(); go("home"); return; } }
  if (kind === "code") { const box = document.getElementById("code-in"); if (window.SE_tryAdminCode) window.SE_tryAdminCode(box ? box.value : ""); return; }
  render();
}
function onPlot(id) {
  const s = getState(); const def = BUSINESSES.find((b) => b.id === id); if (!def) return;
  if (!s.unlockedDistricts.includes(def.district)) return onDistrict(def.district);
  if (s.businesses[id]) return openManage(id);
  sheet(`<h3>${def.icon} ${def.name}</h3><p>Price ${formatMoney(def.price)}</p><button class="btn primary block" id="buy" type="button">Purchase</button>`, (root) => {
    root.querySelector("#buy").onclick = () => { buyBusiness(id); closeSheet(); render(); };
  });
}
function onDistrict(id) {
  const d = DISTRICTS.find((x) => x.id === id); const s = getState(); if (!d) return;
  if (s.unlockedDistricts.includes(id)) { notify(`${d.name}: ${holdingsInDistrict(id, s).count} holdings.`); return; }
  const gate = canUnlockDistrict(id);
  sheet(`<h3>${d.name}</h3><p>${d.desc}</p><button class="btn primary block" id="un" ${gate.ok ? "" : "disabled"} type="button">${gate.ok ? "Unlock district" : gate.reason}</button>`, (root) => {
    const b = root.querySelector("#un"); if (gate.ok) b.onclick = () => { unlockDistrict(id); closeSheet(); render(); };
  });
}
function openManage(id) {
  const s = getState(); const inst = s.businesses[id]; const def = BUSINESSES.find((b) => b.id === id);
  if (!inst || !def) return; const r = businessRates(s, inst); const cost = upgradeCost(def.price, inst.level);
  sheet(`<h3>${def.icon} ${def.name}</h3><p class="tiny">Lv ${inst.level}/${def.maxLevel} · ${formatMoney(r.profit)}/hr</p>
    <button class="btn primary block" id="up" type="button">Upgrade ${inst.level >= def.maxLevel ? "(max)" : formatMoney(cost)}</button>`, (root) => {
    root.querySelector("#up").onclick = () => { upgradeBusiness(id); closeSheet(); render(); };
  });
}
function openAssign(empId) {
  const s = getState(); const ids = Object.keys(s.businesses);
  sheet(`<h3>Assign employee</h3><button class="btn block" data-a="" type="button">Unassign</button>${ids.map((id) => `<button class="btn block" data-a="${id}" type="button">${(BUSINESSES.find((b) => b.id === id) || { name: id }).name}</button>`).join("")}`, (root) => {
    root.querySelectorAll("[data-a]").forEach((b) => b.onclick = () => { assignEmployee(empId, b.dataset.a || null); closeSheet(); render(); });
  });
}
function sheet(html, bind) {
  closeSheet(); const host = qs("#modal-host");
  host.innerHTML = `<div class="modal-backdrop"><div class="sheet">${html}</div></div>`;
  host.querySelector(".modal-backdrop").onclick = (e) => { if (e.target.classList.contains("modal-backdrop")) closeSheet(); };
  if (bind) bind(host);
}
export function closeSheet() { const h = qs("#modal-host"); if (h) h.innerHTML = ""; }
export function showWelcomeBack(info) {
  if (!info || info.amount <= 0) return;
  sheet(`<div class="welcome-back"><div class="tiny">WELCOME BACK</div><p>Your businesses earned</p><div class="big">${info.label || formatMoney(info.amount)}</div>
    <button class="btn primary block" id="wb" type="button">Collect</button></div>`, (root) => { root.querySelector("#wb").onclick = () => { closeSheet(); render(); }; });
}
export function startTutorial() {
  const steps = [["Welcome to Street Empire", "You have $10,000 and a slice of Downtown. Grow a city-wide company from here."], ["Buy a business", "Open Shop and buy Corner Bites Cart."], ["Collect income", "Profits stack in each shop. Tap Collect on Home."], ["Expand", "Unlock districts, hire staff, and keep growing."]];
  let i = 0; const host = qs("#tutorial-host");
  const end = () => { if (host) host.innerHTML = ""; patch((s) => { s.tutorialDone = true; s.tutorialStep = 99; }); saveGame(true); go("home"); };
  const show = () => {
    const st = steps[i];
    host.innerHTML = `<div class="tutorial-mask"><div class="tutorial-card"><div class="tiny">TUTORIAL ${i + 1}/${steps.length}</div><h3>${st[0]}</h3><p>${st[1]}</p>
      <div class="row"><button class="btn" id="skip" type="button">Skip</button><button class="btn primary" id="next" type="button">${i === steps.length - 1 ? "Start playing" : "Next"}</button></div></div></div>`;
    host.querySelector("#skip").onclick = end;
    host.querySelector("#next").onclick = () => { i += 1; if (i >= steps.length) end(); else show(); };
  };
  if (host) show();
}
