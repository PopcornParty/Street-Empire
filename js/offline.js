import { OFFLINE_CAP_HOURS } from "./data.js";
import { getState, patch } from "./state.js";
import { tickBusinesses } from "./businesses.js";
import { formatMoney, now } from "./utils.js";

export function applyOffline() {
  const s = getState();
  const elapsed = Math.max(0, now() - (s.lastOnline || s.lastTick || now()));
  const cap = OFFLINE_CAP_HOURS * 3600000;
  const used = Math.min(elapsed, cap);
  if (used < 8000) {
    patch((st) => { st.lastOnline = now(); st.lastTick = now(); });
    return null;
  }
  const before = s.cash;
  let produced = 0;
  patch((st) => {
    produced = tickBusinesses(st, used);
    if (elapsed >= 4 * 3600000) st.stats.longOffline = 1;
    st.lastOnline = now();
    st.lastTick = now();
  });
  const rentGain = Math.max(0, getState().cash - before);
  const total = Math.floor(produced + rentGain);
  return {
    ms: used,
    capped: elapsed > cap,
    amount: total,
    label: formatMoney(total)
  };
}
