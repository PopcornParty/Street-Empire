import { createNewState, getState, setState } from "./state.js";
import { now } from "./utils.js";

const KEY = "street-empire-save-v1";

export function saveGame(silent = false) {
  const s = getState();
  if (!s) return;
  s.lastSave = now();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    if (!silent) window.dispatchEvent(new CustomEvent("se-saved"));
  } catch (e) {
    console.warn("Save failed", e);
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.cash !== "number") return null;
    return migrate(parsed);
  } catch {
    return null;
  }
}

function migrate(s) {
  const base = createNewState();
  const merged = { ...base, ...s };
  merged.stats = { ...base.stats, ...(s.stats || {}) };
  merged.settings = { ...base.settings, ...(s.settings || {}) };
  merged.daily = { ...base.daily, ...(s.daily || {}) };
  merged.businesses = s.businesses || {};
  merged.properties = s.properties || {};
  merged.vehicles = s.vehicles || {};
  merged.employees = s.employees || [];
  merged.unlockedDistricts = s.unlockedDistricts?.length ? s.unlockedDistricts : ["downtown"];
  return merged;
}

export function resetGame() {
  localStorage.removeItem(KEY);
  setState(createNewState());
  saveGame(true);
}

export function exportSave() {
  const s = getState();
  s.stats.exports += 1;
  return JSON.stringify(s, null, 2);
}

export function importSave(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed.cash !== "number") throw new Error("Invalid save");
  setState(migrate(parsed));
  saveGame(true);
}

export function bootState() {
  const loaded = loadGame();
  setState(loaded || createNewState());
  return !loaded;
}
