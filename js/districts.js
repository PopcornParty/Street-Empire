import { DISTRICTS } from "./data.js";
import { getState, patch, logActivity } from "./state.js";
import { empireLevel } from "./economy.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";

export function districtUnlocked(id, s = getState()) {
  return s.unlockedDistricts.includes(id);
}

export function canUnlockDistrict(id) {
  const s = getState();
  const d = DISTRICTS.find((x) => x.id === id);
  if (!d) return { ok: false };
  if (s.unlockedDistricts.includes(id)) return { ok: false, reason: "Already open" };
  const prev = DISTRICTS.find((x) => x.order === d.order - 1);
  if (prev && !s.unlockedDistricts.includes(prev.id)) return { ok: false, reason: "Unlock the previous district first" };
  if (s.cash < d.unlockCash) return { ok: false, reason: "Not enough cash" };
  if (s.reputation < d.unlockRep) return { ok: false, reason: `Need ${d.unlockRep} reputation` };
  if (empireLevel(s.xp).level < d.unlockLevel) return { ok: false, reason: `Need empire level ${d.unlockLevel}` };
  return { ok: true, cost: Math.floor(d.unlockCash * 0.15) };
}

export function unlockDistrict(id) {
  const gate = canUnlockDistrict(id);
  if (!gate.ok) { notify(gate.reason || "Locked"); return false; }
  const d = DISTRICTS.find((x) => x.id === id);
  const fee = gate.cost;
  patch((s) => {
    s.cash -= fee;
    s.stats.spent += fee;
    s.unlockedDistricts.push(id);
    s.xp += 60;
    s.reputation += 8;
    logActivity(s, `District unlocked: ${d.name}.`);
  });
  sfx("unlock");
  notify(`${d.name} is open for business.`, "NEW DISTRICT UNLOCKED");
  showUnlockBanner(d.name);
  return true;
}

export function showUnlockBanner(text) {
  const host = document.getElementById("fx-host");
  if (!host) return;
  const wrap = document.createElement("div");
  wrap.className = "level-banner";
  wrap.innerHTML = `<div class="inner"><div class="tiny">DISTRICT UNLOCKED</div><h2>${text}</h2><button class="btn primary" type="button">Continue</button></div>`;
  wrap.querySelector("button").onclick = () => wrap.remove();
  host.appendChild(wrap);
  setTimeout(() => wrap.remove(), 2800);
}
