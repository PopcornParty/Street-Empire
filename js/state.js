import { START_CASH, BUSINESSES, DISTRICTS } from "./data.js";
import { now, uid } from "./utils.js";

export function emptyBusinessState(defId) {
  return {
    id: defId,
    level: 1,
    cats: { building: 0, equipment: 0, staff: 0, ads: 0, tech: 0, efficiency: 0 },
    stored: 0,
    lastTick: now(),
    employees: []
  };
}

export function createNewState() {
  return {
    version: "1.0.0",
    playerId: uid() + uid(),
    username: "Founder",
    avatar: "🙂",
    createdAt: now(),
    lastSave: now(),
    lastTick: now(),
    lastOnline: now(),
    cash: START_CASH,
    xp: 0,
    reputation: 2,
    hq: 0,
    businesses: {},
    properties: {},
    employees: [],
    vehicles: {},
    activeVehicle: null,
    unlockedDistricts: ["downtown"],
    missionsDone: [],
    achievements: [],
    contracts: [],
    contractsDone: 0,
    activeEvent: null,
    eventsSeen: 0,
    daily: { lastClaim: 0, streak: 0, dayIndex: 0 },
    stats: {
      spent: 0, earned: 0, collects: 0, upgrades: 0, rentEarned: 0, playMs: 0,
      bigCollect: 0, exports: 0, recolors: 0, themeChange: 0, assigned: 0, dailies: 0, longOffline: 0
    },
    settings: { music: 0.35, sfx: 0.7, vibrate: true, graphics: "high", notifications: true, theme: "dark" },
    tutorialStep: 0,
    tutorialDone: false,
    activity: ["A new founder arrives in the city with $10,000 and a plan."],
    boostUntil: 0,
    boostMult: 1,
    notifications: []
  };
}

let _state = null;
const listeners = new Set();
export function getState() { return _state; }
export function setState(next) {
  _state = next;
  listeners.forEach((fn) => { try { fn(_state); } catch (e) { console.error(e); } });
}
export function patch(mutator) { const s = _state; mutator(s); setState(s); }
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function bizDef(id) { return BUSINESSES.find((b) => b.id === id); }
export function districtDef(id) { return DISTRICTS.find((d) => d.id === id); }
export function ownedBusinessList(s = _state) { return Object.values(s.businesses); }
export function logActivity(s, text) { s.activity.unshift(text); s.activity = s.activity.slice(0, 24); }
