import { BUSINESSES, UPGRADE_CATS } from "./data.js";
import { getState, patch, bizDef, emptyBusinessState, logActivity } from "./state.js";
import { businessRates, upgradeCost, catCost, slotCap, staffSalary } from "./economy.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";
import { haptic } from "./utils.js";

export function canBuyBusiness(id) {
  const s = getState(); const def = bizDef(id);
  if (!def) return { ok: false, reason: "Unknown business" };
  if (s.businesses[id]) return { ok: false, reason: "Already owned" };
  if (!s.unlockedDistricts.includes(def.district)) return { ok: false, reason: "District locked" };
  if (s.reputation < def.repReq) return { ok: false, reason: `Need ${def.repReq} reputation` };
  if (Object.keys(s.businesses).length >= slotCap(s)) return { ok: false, reason: "No free slots — buy property or upgrade HQ" };
  if (s.cash < def.price) return { ok: false, reason: "Not enough cash" };
  return { ok: true };
}

export function buyBusiness(id) {
  const gate = canBuyBusiness(id);
  if (!gate.ok) { notify(gate.reason); return false; }
  const def = bizDef(id);
  patch((s) => {
    s.cash -= def.price; s.stats.spent += def.price;
    s.businesses[id] = emptyBusinessState(id);
    s.reputation += 2 + def.tier; s.xp += 25 + def.tier * 10;
    logActivity(s, `Opened ${def.name} in ${def.district}.`);
  });
  sfx("buy"); haptic(18);
  notify(`${def.name} is yours.`, "BUSINESS PURCHASED");
  return true;
}

export function collectBusiness(id) {
  const s = getState(); const inst = s.businesses[id];
  if (!inst || inst.stored <= 0) return 0;
  const amt = Math.floor(inst.stored);
  patch((st) => {
    st.cash += amt; st.stats.earned += amt; st.stats.collects += 1;
    if (amt > st.stats.bigCollect) st.stats.bigCollect = amt;
    st.businesses[id].stored = 0;
  });
  sfx("collect"); haptic(10);
  notify(`Collected from ${bizDef(id).name}.`);
  return amt;
}

export function collectAll() {
  const s = getState(); let total = 0;
  for (const id of Object.keys(s.businesses)) total += collectBusiness(id);
  if (total > 0) notify("Swept the tills.", "COLLECT");
  return total;
}

export function upgradeBusiness(id) {
  const s = getState(); const inst = s.businesses[id]; const def = bizDef(id);
  if (!inst || !def) return false;
  if (inst.level >= def.maxLevel) { notify("Already at max level"); return false; }
  const cost = upgradeCost(def.price, inst.level);
  if (s.cash < cost) { notify("Not enough cash"); return false; }
  patch((st) => {
    st.cash -= cost; st.stats.spent += cost; st.stats.upgrades += 1;
    st.businesses[id].level += 1; st.xp += 15 + inst.level * 2; st.reputation += 1;
    logActivity(st, `${def.name} reached level ${st.businesses[id].level}.`);
  });
  sfx("upgrade"); haptic(16);
  notify(`${def.name} upgraded to Lv ${inst.level + 1}.`, "UPGRADE COMPLETE");
  return true;
}

export function upgradeCategory(id, catId) {
  const s = getState(); const inst = s.businesses[id]; const def = bizDef(id);
  if (!inst || !def) return false;
  const lv = inst.cats[catId] || 0;
  if (lv >= 12) { notify("Category maxed"); return false; }
  const cost = catCost(def.price, lv);
  if (s.cash < cost) { notify("Not enough cash"); return false; }
  patch((st) => {
    st.cash -= cost; st.stats.spent += cost; st.stats.upgrades += 1;
    st.businesses[id].cats[catId] = lv + 1; st.xp += 8;
  });
  sfx("upgrade");
  notify(`${UPGRADE_CATS.find((c) => c.id === catId).name} +1`);
  return true;
}

export function tickBusinesses(s, dtMs) {
  const hours = dtMs / 3600000; let produced = 0;
  for (const inst of Object.values(s.businesses)) {
    const r = businessRates(s, inst);
    const add = Math.max(0, r.profit) * hours;
    inst.stored += add; produced += add;
  }
  for (const p of Object.values(s.properties)) {
    const rent = (p.rent || 0) * Math.pow(1.18, (p.level || 1) - 1) * hours;
    s.cash += rent; s.stats.rentEarned += rent; s.stats.earned += rent;
  }
  let payroll = 0;
  for (const e of s.employees || []) payroll += staffSalary(e.salary, e.level) * hours;
  s.cash = Math.max(0, s.cash - payroll);
  return produced;
}

export function shopBusinesses() { return BUSINESSES; }
