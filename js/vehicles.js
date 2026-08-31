import { VEHICLES, CAR_COLORS } from "./data.js";
import { getState, patch, logActivity } from "./state.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";
import { pick } from "./utils.js";

export function vehDef(id) { return VEHICLES.find((v) => v.id === id); }

export function buyVehicle(id) {
  const s = getState();
  const def = vehDef(id);
  if (!def) return false;
  if (s.vehicles[id]) { notify("Already owned"); return false; }
  if (s.cash < def.price) { notify("Not enough cash"); return false; }
  patch((st) => {
    st.cash -= def.price;
    st.stats.spent += def.price;
    st.vehicles[id] = { id, color: pick(CAR_COLORS), upgraded: false };
    if (!st.activeVehicle) st.activeVehicle = id;
    st.xp += 15;
    logActivity(st, `Parked a new ${def.name} in the garage.`);
  });
  sfx("buy");
  notify(`${def.name} added to garage.`, "VEHICLE");
  return true;
}

export function setActiveVehicle(id) {
  if (!getState().vehicles[id]) return;
  patch((s) => { s.activeVehicle = id; });
  notify(`${vehDef(id).name} is now active.`);
}

export function recolorVehicle(id, color) {
  patch((s) => {
    if (!s.vehicles[id]) return;
    s.vehicles[id].color = color;
    s.stats.recolors += 1;
  });
}

export function upgradeVehicle(id) {
  const s = getState();
  const def = vehDef(id);
  const v = s.vehicles[id];
  if (!v || !def) return false;
  if (v.upgraded) { notify("Already tuned"); return false; }
  const cost = Math.floor(def.price * 0.4);
  if (s.cash < cost) { notify("Not enough cash"); return false; }
  patch((st) => {
    st.cash -= cost;
    st.stats.spent += cost;
    st.vehicles[id].upgraded = true;
    st.xp += 12;
  });
  sfx("upgrade");
  notify(`${def.name} tuned. +1% empire bonus.`);
  return true;
}
