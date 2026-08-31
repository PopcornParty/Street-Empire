import { CONTRACTS } from "./data.js";
import { getState, patch, logActivity, bizDef } from "./state.js";
import { notify } from "./notifications.js";
import { sfx } from "./audio.js";
import { now } from "./utils.js";

export function ownedTags(s = getState()) {
  const tags = new Set();
  for (const id of Object.keys(s.businesses)) (bizDef(id)?.tags || []).forEach((t) => tags.add(t));
  return tags;
}

export function availableContracts(s = getState()) {
  const tags = ownedTags(s);
  const activeIds = new Set(s.contracts.map((c) => c.id));
  return CONTRACTS.filter((c) => tags.has(c.reqTag) && !activeIds.has(c.id));
}

export function startContract(id) {
  const s = getState();
  const def = CONTRACTS.find((c) => c.id === id);
  if (!def) return false;
  if (s.contracts.some((c) => c.id === id)) { notify("Already running"); return false; }
  if (!ownedTags(s).has(def.reqTag)) { notify("You need a matching business"); return false; }
  if (s.contracts.length >= 3) { notify("Max 3 active contracts"); return false; }
  patch((st) => {
    st.contracts.push({ id, ends: now() + def.hours * 3600000, started: now() });
    logActivity(st, `Contract started: ${def.name}.`);
  });
  sfx("click");
  notify(`${def.name} is underway (${def.hours}h).`, "CONTRACT");
  return true;
}

export function settleContracts(s = getState()) {
  const done = []; const keep = [];
  for (const c of s.contracts) {
    if (c.ends <= now()) done.push(c); else keep.push(c);
  }
  if (!done.length) return 0;
  patch((st) => {
    st.contracts = keep;
    for (const c of done) {
      const def = CONTRACTS.find((x) => x.id === c.id);
      if (!def) continue;
      st.cash += def.reward; st.xp += def.xp; st.reputation += 4;
      st.contractsDone += 1; st.stats.earned += def.reward;
      logActivity(st, `Contract complete: ${def.name}.`);
    }
  });
  for (const c of done) {
    const def = CONTRACTS.find((x) => x.id === c.id);
    if (def) notify(`${def.name} paid.`, "CONTRACT COMPLETE");
  }
  return done.length;
}
