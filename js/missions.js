import { MISSIONS } from "./data.js";
import { getState, patch, logActivity, bizDef } from "./state.js";
import { totalIncome, netWorth, empireLevel } from "./economy.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";

export function metric(s, check, value) {
  const biz = Object.values(s.businesses);
  const props = Object.values(s.properties);
  switch (check) {
    case "ownBiz": return biz.length;
    case "ownProp": return props.length;
    case "ownStaff": return s.employees.length;
    case "ownVeh": return Object.keys(s.vehicles).length;
    case "cash": return s.cash;
    case "income": return totalIncome(s).profit;
    case "networth": return netWorth(s);
    case "level": return empireLevel(s.xp).level;
    case "collects": return s.stats.collects;
    case "anyLevel": return Math.max(0, ...biz.map((b) => b.level));
    case "district": return s.unlockedDistricts.includes(value) ? 1 : 0;
    case "contractsDone": return s.contractsDone;
    case "dailies": return s.stats.dailies;
    case "assigned": return s.stats.assigned;
    case "hq": return s.hq;
    case "achs": return s.achievements.length;
    case "catLevel": return Math.max(0, ...biz.flatMap((b) => Object.values(b.cats || { 0: 0 })));
    case "eventsSeen": return s.eventsSeen;
    case "ownId": return s.businesses[value] ? 1 : 0;
    case "allDistricts": return s.unlockedDistricts.length;
    case "staffLevel": return Math.max(0, ...s.employees.map((e) => e.level), 0);
    case "districtCount": return s.unlockedDistricts.length;
    case "spent": return s.stats.spent;
    case "streak": return s.daily?.streak || 0;
    case "upgrades": return s.stats.upgrades;
    case "ownTag": return Object.keys(s.businesses).some((id) => (bizDef(id)?.tags || []).includes(value)) ? 1 : 0;
    case "allRoles": return new Set(s.employees.map((e) => e.role)).size;
    case "rentEarned": return s.stats.rentEarned;
    case "missionsDone": return s.missionsDone.length;
    case "recolors": return s.stats.recolors;
    case "themeChange": return s.stats.themeChange;
    case "exports": return s.stats.exports;
    case "inDistrict": {
      const [d, n] = String(value).split(":");
      const bc = Object.keys(s.businesses).filter((id) => bizDef(id)?.district === d).length;
      const pc = Object.values(s.properties).filter((p) => p.district === d).length;
      return bc + pc >= Number(n) ? Number(n) : bc + pc;
    }
    case "propType": return Object.values(s.properties).some((p) => p.type === value) ? 1 : 0;
    case "bigCollect": return s.stats.bigCollect;
    case "playMs": return s.stats.playMs;
    case "maxId": {
      const inst = s.businesses[value];
      const def = bizDef(value);
      return inst && def && inst.level >= def.maxLevel ? 1 : 0;
    }
    case "ownRole": return s.employees.some((e) => e.role === value) ? 1 : 0;
    case "ownVehId": return s.vehicles[value] ? 1 : 0;
    case "longOffline": return s.stats.longOffline;
    default: return 0;
  }
}

export function missionProgress(m, s = getState()) {
  if (m.check === "district" || m.check === "ownId") {
    return { have: metric(s, m.check, m.value), need: 1, done: metric(s, m.check, m.value) >= 1 };
  }
  const have = metric(s, m.check, m.value);
  return { have, need: m.value, done: have >= m.value };
}

export function claimableMissions(s = getState()) {
  return MISSIONS.filter((m) => !s.missionsDone.includes(m.id) && missionProgress(m, s).done);
}

export function claimMission(id) {
  const s = getState();
  const m = MISSIONS.find((x) => x.id === id);
  if (!m || s.missionsDone.includes(id)) return false;
  if (!missionProgress(m, s).done) return false;
  patch((st) => {
    st.missionsDone.push(id);
    st.cash += m.cash;
    st.xp += m.xp;
    st.reputation += m.rep;
    st.stats.earned += m.cash;
    logActivity(st, `Mission complete: ${m.name}.`);
  });
  sfx("ach");
  notify(`${m.name}  +$${m.cash.toLocaleString()}`, "MISSION COMPLETE");
  return true;
}

export function autoClaimReady() {
  for (const m of claimableMissions()) claimMission(m.id);
}
