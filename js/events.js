import { EVENTS } from "./data.js";
import { getState, patch, logActivity } from "./state.js";
import { notify } from "./notifications.js";
import { pick, now } from "./utils.js";

export function rollCityEvent(force = false) {
  const s = getState();
  if (!s) return;
  if (s.activeEvent && s.activeEvent.until > now()) return s.activeEvent;
  if (!force && Math.random() > 0.18) {
    if (s.activeEvent && s.activeEvent.until <= now()) {
      patch((st) => { st.activeEvent = null; });
    }
    return null;
  }
  const ev = pick(EVENTS);
  const until = now() + ev.minutes * 60000;
  patch((st) => {
    st.activeEvent = { id: ev.id, name: ev.name, mult: ev.mult, tags: ev.tags, until, desc: ev.desc };
    st.eventsSeen += 1;
    logActivity(st, `City event: ${ev.name}.`);
  });
  notify(ev.desc, ev.name.toUpperCase());
  return ev;
}

export function currentEvent(s = getState()) {
  if (!s?.activeEvent) return null;
  if (s.activeEvent.until <= now()) return null;
  return s.activeEvent;
}
