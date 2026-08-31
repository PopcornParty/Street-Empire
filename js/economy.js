import { UPGRADE_CATS, EMPIRE_RANKS, VEHICLES } from "./data.js";
import { bizDef, getState } from "./state.js";

export function incomeAtLevel(base, level) { return Math.floor(base * Math.pow(1.22, level - 1)); }
export function opexAtLevel(base, level) { return Math.floor(base * Math.pow(1.12, level - 1)); }
export function upgradeCost(price, level) { return Math.floor(price * 0.42 * Math.pow(1.34, level - 1)); }
export function catCost(price, catLevel) { return Math.floor(price * 0.12 * Math.pow(1.38, catLevel)); }
export function staffSalary(roleSalary, level) { return Math.floor(roleSalary * (1 + (level - 1) * 0.18) * 24); }
export function staffBonus(roleBonus, level) { return roleBonus * (1 + (level - 1) * 0.12); }

export function businessRates(s, inst) {
  const def = bizDef(inst.id);
  if (!def) return { income: 0, opex: 0, profit: 0 };
  let income = incomeAtLevel(def.income, inst.level);
  let opex = opexAtLevel(def.opex, inst.level);
  let eff = 1;
  for (const cat of UPGRADE_CATS) {
    const lv = inst.cats[cat.id] || 0;
    if (cat.effect === "income") income *= 1 + cat.per * lv;
    if (cat.effect === "opex") opex *= Math.max(0.35, 1 + cat.per * lv);
    if (cat.effect === "efficiency") eff *= 1 + cat.per * lv;
  }
  for (const e of (s.employees || []).filter((x) => x.assigned === inst.id)) income *= 1 + staffBonus(e.bonus, e.level);
  if (s.activeVehicle && VEHICLES.find((v) => v.id === s.activeVehicle)) {
    const v = VEHICLES.find((x) => x.id === s.activeVehicle);
    const veh = s.vehicles[s.activeVehicle];
    income *= 1 + v.bonus + (veh?.upgraded ? 0.01 : 0);
  }
  income *= eventMult(s, def);
  if (s.boostUntil > Date.now()) income *= s.boostMult || 1;
  income *= 1 + Math.min(0.25, s.hq * 0.04);
  income *= eff;
  income = Math.floor(income); opex = Math.floor(opex);
  return { income, opex, profit: income - opex };
}

export function eventMult(s, def) {
  const ev = s.activeEvent;
  if (!ev || ev.until < Date.now()) return 1;
  if (!ev.tags) return ev.mult;
  return def.tags?.some((t) => ev.tags.includes(t)) ? ev.mult : 1;
}

export function propertyRent(def, level = 1) { return Math.floor(def.rent * Math.pow(1.18, level - 1)); }

export function totalIncome(s = getState()) {
  let inc = 0, exp = 0;
  for (const inst of Object.values(s.businesses)) { const r = businessRates(s, inst); inc += r.income; exp += r.opex; }
  for (const p of Object.values(s.properties)) inc += propertyRent(p.def || { rent: p.rent }, p.level);
  for (const e of s.employees) exp += staffSalary(e.salary, e.level);
  return { income: inc, expenses: exp, profit: inc - exp };
}

export function netWorth(s = getState()) {
  let assets = s.cash;
  for (const inst of Object.values(s.businesses)) { const def = bizDef(inst.id); if (def) assets += def.price * (0.7 + inst.level * 0.12); }
  for (const p of Object.values(s.properties)) assets += (p.price || 0) * 0.85;
  for (const id of Object.keys(s.vehicles)) { const v = VEHICLES.find((x) => x.id === id); if (v) assets += v.price * 0.6; }
  return Math.floor(assets);
}

export function empireLevel(xp) {
  let rank = EMPIRE_RANKS[0];
  for (const r of EMPIRE_RANKS) if (xp >= r.xp) rank = r;
  const next = EMPIRE_RANKS.find((r) => r.level === rank.level + 1);
  return { ...rank, nextXp: next ? next.xp : rank.xp, nextName: next?.name || "Max" };
}

export function xpToNext(s) {
  const r = empireLevel(s.xp);
  const span = Math.max(1, r.nextXp - (EMPIRE_RANKS.find((x) => x.level === r.level)?.xp || 0));
  const into = s.xp - (EMPIRE_RANKS.find((x) => x.level === r.level)?.xp || 0);
  return { rank: r, pct: Math.min(1, into / span) };
}

export function slotCap(s) {
  let slots = 1 + s.hq;
  for (const p of Object.values(s.properties)) slots += p.slotBonus || 0;
  return slots + Math.floor((empireLevel(s.xp).level - 1) / 2);
}
