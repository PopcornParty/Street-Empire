import { DAILY, HQ_STAGES } from "./data.js";
import { getState, patch, logActivity } from "./state.js";
import { empireLevel } from "./economy.js";
import { grantRandomEmployee } from "./employees.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";
import { now } from "./utils.js";
let lastRank = 1;
export function checkLevelUp() {
  const s = getState(); const rank = empireLevel(s.xp);
  if (rank.level > lastRank) {
    sfx("level"); notify(`You are now a ${rank.name}.`, `LEVEL ${rank.level}`);
    const host = document.getElementById("fx-host");
    if (host) {
      const wrap = document.createElement("div"); wrap.className = "level-banner";
      wrap.innerHTML = `<div class="inner"><div class="tiny">EMPIRE LEVEL UP</div><h2>Lv ${rank.level}</h2><p>${rank.name}</p><button class="btn primary" type="button">Nice</button></div>`;
      wrap.querySelector("button").onclick = () => wrap.remove(); host.appendChild(wrap);
      setTimeout(() => wrap.remove(), 2600);
    }
  }
  lastRank = rank.level;
}
export function syncRankTracker() { lastRank = empireLevel(getState().xp).level; }
export function canClaimDaily() { const s = getState(); return now() - (s.daily.lastClaim || 0) >= 24 * 3600000 - 60000; }
export function claimDaily() {
  const s = getState(); if (!canClaimDaily()) { notify("Come back tomorrow."); return false; }
  const gap = now() - (s.daily.lastClaim || 0); const broke = s.daily.lastClaim && gap > 48 * 3600000;
  const nextIndex = broke ? 0 : s.daily.dayIndex % 7; const reward = DAILY[nextIndex];
  patch((st) => {
    st.daily.lastClaim = now(); st.daily.dayIndex = nextIndex + 1; st.daily.streak = broke ? 1 : (st.daily.streak || 0) + 1; st.stats.dailies += 1;
    if (reward.type === "cash") { st.cash += reward.value; st.stats.earned += reward.value; }
    if (reward.type === "xp") st.xp += reward.value;
    if (reward.type === "boost") { st.boostUntil = now() + 30 * 60000; st.boostMult = reward.value; }
    logActivity(st, `Daily reward: ${reward.label}.`);
  });
  if (reward.type === "employee") grantRandomEmployee();
  sfx("collect"); notify(reward.label, "DAILY REWARD"); return true;
}
export function upgradeHQ() {
  const s = getState(); const next = HQ_STAGES[s.hq + 1];
  if (!next) { notify("HQ is maxed."); return false; }
  if (s.cash < next.cost) { notify("Not enough cash"); return false; }
  patch((st) => { st.cash -= next.cost; st.stats.spent += next.cost; st.hq += 1; st.xp += 40; st.reputation += 6; logActivity(st, `HQ upgraded: ${next.name}.`); });
  sfx("unlock"); notify(`${next.name} is online.`, "HEADQUARTERS"); return true;
}
