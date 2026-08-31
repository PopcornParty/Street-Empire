import { ACHIEVEMENTS } from "./data.js";
import { getState, patch, logActivity } from "./state.js";
import { metric } from "./missions.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";

export function achProgress(a, s = getState()) {
  const binary = ["district", "ownId", "ownTag", "propType", "maxId", "ownRole", "ownVehId"];
  if (binary.includes(a.check) || a.check === "longOffline") {
    const have = metric(s, a.check, a.value);
    return { have, need: 1, done: have >= 1 };
  }
  if (a.check === "inDistrict") {
    const have = metric(s, a.check, a.value);
    const need = Number(String(a.value).split(":")[1] || 1);
    return { have, need, done: have >= need };
  }
  const have = metric(s, a.check, a.value);
  return { have, need: a.value, done: have >= a.value };
}

export function scanAchievements() {
  const s = getState();
  if (!s) return;
  const fresh = [];
  for (const a of ACHIEVEMENTS) {
    if (s.achievements.includes(a.id)) continue;
    if (achProgress(a, s).done) fresh.push(a);
  }
  if (!fresh.length) return;
  patch((st) => {
    for (const a of fresh) {
      if (st.achievements.includes(a.id)) continue;
      st.achievements.push(a.id);
      st.cash += a.cash;
      st.xp += a.xp;
      st.stats.earned += a.cash;
      logActivity(st, `Achievement: ${a.name}.`);
    }
  });
  for (const a of fresh) {
    sfx("ach");
    notify(`${a.icon} ${a.name}`, "ACHIEVEMENT UNLOCKED");
  }
}
