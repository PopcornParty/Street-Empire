import { TICK_MS, AUTOSAVE_MS } from "./data.js";
import { getState, patch } from "./state.js";
import { bootState, saveGame } from "./save.js";
import { tickBusinesses } from "./businesses.js";
import { settleContracts } from "./contracts.js";
import { rollCityEvent } from "./events.js";
import { scanAchievements } from "./achievements.js";
import { autoClaimReady } from "./missions.js";
import { checkLevelUp, syncRankTracker } from "./progression.js";
import { applyOffline } from "./offline.js";
import { setVolumes, startMusic, unlockAudio } from "./audio.js";
import { bindChrome, render, startTutorial, showWelcomeBack, renderTop } from "./ui.js";
import { bindAdminCode } from "./admin.js";
import { now } from "./utils.js";

function bootError(err) {
  console.error(err);
  const host = document.getElementById("screen-host");
  if (host) {
    host.innerHTML = `<section class="card section"><h2 class="h2">Could not start</h2><p class="tiny">${String(err && err.message ? err.message : err)}</p></section>`;
  }
}

try {
  const isNew = bootState();
  bindChrome();
  bindAdminCode();
  const s0 = getState();
  setVolumes(s0.settings.music, s0.settings.sfx);
  const offline = applyOffline();
  syncRankTracker();
  render();
  if (isNew || !s0.tutorialDone) startTutorial();
  if (offline && offline.amount > 0) showWelcomeBack(offline);
  setInterval(() => {
    const s = getState();
    if (!s) return;
    const dt = Math.min(now() - s.lastTick, 15000);
    patch((st) => {
      tickBusinesses(st, dt);
      st.lastTick = now();
      st.lastOnline = now();
      st.stats.playMs += dt;
    });
    settleContracts();
    if (Math.random() < 0.04) rollCityEvent(false);
    scanAchievements();
    autoClaimReady();
    checkLevelUp();
    renderTop();
  }, TICK_MS);
  setInterval(() => saveGame(true), AUTOSAVE_MS);
  window.addEventListener("beforeunload", () => saveGame(true));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) saveGame(true);
  });
  window.addEventListener("pointerdown", () => {
    unlockAudio();
    if (getState().settings.music > 0.02) startMusic();
  }, { once: true });
} catch (err) {
  bootError(err);
}
