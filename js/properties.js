import { PROPERTIES } from "./data.js";
import { getState, patch, logActivity } from "./state.js";
import { propertyRent } from "./economy.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";

export function propDef(id) { return PROPERTIES.find((p) => p.id === id); }

export function buyProperty(id) {
  const s = getState();
  const def = propDef(id);
  if (!def) return false;
  if (s.properties[id]) { notify("Already owned"); return false; }
  if (!s.unlockedDistricts.includes(def.district)) { notify("District locked"); return false; }
  if (s.reputation < def.repReq) { notify(`Need ${def.repReq} reputation`); return false; }
  if (s.cash < def.price) { notify("Not enough cash"); return false; }
  patch((st) => {
    st.cash -= def.price;
    st.stats.spent += def.price;
    st.properties[id] = {
      id, level: 1, price: def.price, rent: def.rent, slotBonus: def.slotBonus || 0, type: def.type, district: def.district
    };
    st.xp += 30;
    st.reputation += 3;
    logActivity(st, `Purchased property: ${def.name}.`);
  });
  sfx("buy");
  notify(`${def.name} purchased.`, "PROPERTY");
  return true;
}

export function upgradeProperty(id) {
  const s = getState();
  const p = s.properties[id];
  const def = propDef(id);
  if (!p || !def) return false;
  if (p.level >= 8) { notify("Property maxed"); return false; }
  const cost = Math.floor(def.price * 0.35 * Math.pow(1.32, p.level - 1));
  if (s.cash < cost) { notify("Not enough cash"); return false; }
  patch((st) => {
    st.cash -= cost;
    st.stats.spent += cost;
    st.properties[id].level += 1;
    st.xp += 12;
    st.reputation += 1;
  });
  sfx("upgrade");
  notify(`${def.name} renovated to Lv ${p.level + 1}.`);
  return true;
}

export function sellProperty(id) {
  const s = getState();
  const p = s.properties[id];
  const def = propDef(id);
  if (!p) return false;
  const value = Math.floor((p.price || def.price) * 0.6);
  patch((st) => {
    delete st.properties[id];
    st.cash += value;
    logActivity(st, `Sold ${def.name} for $${value.toLocaleString()}.`);
  });
  notify(`Sold ${def.name} for $${value.toLocaleString()}.`);
  return true;
}

export function propertyIncomeHour(s) {
  let n = 0;
  for (const p of Object.values(s.properties)) {
    const def = propDef(p.id);
    n += propertyRent(def || p, p.level);
  }
  return n;
}
