let ctx;
let musicTimer = null;
let musicOn = false;

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function beep(freq, dur, type = "sine", gain = 0.05) {
  try {
    const c = ac();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain * sfxVol();
    o.connect(g); g.connect(c.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.stop(c.currentTime + dur + 0.02);
  } catch {}
}

function sfxVol() { return Number(window.__se_sfx ?? 0.7); }
function musicVol() { return Number(window.__se_music ?? 0.35); }
export function setVolumes(music, sfx) { window.__se_music = music; window.__se_sfx = sfx; }

export function sfx(kind) {
  if (sfxVol() <= 0.01) return;
  if (kind === "click") beep(520, 0.05, "triangle", 0.03);
  if (kind === "buy") { beep(420, 0.08, "square", 0.04); setTimeout(() => beep(640, 0.1, "square", 0.04), 70); }
  if (kind === "upgrade") { beep(500, 0.07); setTimeout(() => beep(760, 0.12), 80); }
  if (kind === "collect") beep(880, 0.09, "sine", 0.04);
  if (kind === "level") { beep(392, 0.12); setTimeout(() => beep(523, 0.12), 110); setTimeout(() => beep(784, 0.18), 220); }
  if (kind === "unlock") { beep(330, 0.1); setTimeout(() => beep(495, 0.16), 120); }
  if (kind === "ach") { beep(660, 0.1); setTimeout(() => beep(990, 0.16), 90); }
}

export function startMusic() { musicOn = true; loopMusic(); }
export function stopMusic() { musicOn = false; if (musicTimer) clearTimeout(musicTimer); }

function loopMusic() {
  if (!musicOn || musicVol() < 0.02) return;
  const notes = [196, 247, 294, 247, 220, 196, 165, 196];
  let i = 0;
  const step = () => {
    if (!musicOn) return;
    try {
      const c = ac();
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "sine";
      o.frequency.value = notes[i % notes.length];
      g.gain.value = 0.025 * musicVol();
      o.connect(g); g.connect(c.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.35);
      o.stop(c.currentTime + 0.38);
    } catch {}
    i++;
    musicTimer = setTimeout(step, 420);
  };
  step();
}

export function unlockAudio() { try { ac().resume(); } catch {} }
