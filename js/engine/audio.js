// Sound-Engine: alle Geräusche und die Musik werden live erzeugt
import { SOUND } from '../config/sound.js';
import { save, persist } from './save.js';

export const AC = { ctx: null, gemCombo: 0 };
export function audioInit() {
  if (AC.ctx) { if (AC.ctx.state === 'suspended') AC.ctx.resume(); return; }
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
  const c = new C(); AC.ctx = c;
  AC.master = c.createGain(); AC.master.gain.value = save.muted ? 0 : SOUND.master; AC.master.connect(c.destination);
  AC.out = c.createGain(); AC.out.gain.value = SOUND.effects; AC.out.connect(AC.master);
  AC.mus = c.createGain(); AC.mus.gain.value = SOUND.music; AC.mus.connect(AC.master);
  const b = c.createBuffer(1, c.sampleRate, c.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; AC.noise = b;
}
function env(g, t, a, d, v) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
function osc(type, f, t, d, v, f2, dest) {
  const c = AC.ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d); env(g, t, .004, d, v); o.connect(g); g.connect(dest || AC.out); o.start(t); o.stop(t + d + .05);
}
function nz(t, d, v, freq, type, dest) {
  const c = AC.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = AC.noise;
  f.type = type || 'lowpass'; f.frequency.value = freq; env(g, t, .002, d, v); s.connect(f); f.connect(g); g.connect(dest || AC.out); s.start(t, Math.random() * .5); s.stop(t + d + .05);
}
// Jedes Geräusch: Name → Rezept
const SFX = {
  shot: t => { nz(t, .05, .22, 2800, 'highpass'); osc('square', 820, t, .04, .05, 260); },
  shotgun: t => { nz(t, .2, .5, 1100); osc('sine', 130, t, .16, .32, 45); },
  flame: t => { nz(t, .2, .13, 700, 'bandpass'); },
  hit: t => { osc('square', 200 + Math.random() * 80, t, .03, .035, 110); },
  die: t => { nz(t, .12, .16, 450); osc('sine', 150, t, .12, .14, 55); },
  gem: t => { const p = Math.min(2, 1 + AC.gemCombo * .06); osc('sine', 740 * p, t, .07, .07); },
  coin: t => { osc('square', 1320, t, .04, .045); osc('square', 1760, t + .05, .07, .045); },
  level: t => { [523, 659, 784, 1046, 1318].forEach((f, i) => osc('triangle', f, t + i * .07, .16, .13)); },
  hurt: t => { osc('sawtooth', 190, t, .22, .18, 70); nz(t, .08, .15, 900); },
  boom: t => { nz(t, .5, .55, 550); osc('sine', 95, t, .4, .45, 32); },
  zap: t => { osc('sawtooth', 1500, t, .12, .06, 180); nz(t, .1, .12, 4200, 'highpass'); },
  throw: t => { osc('triangle', 420, t, .14, .05, 880); },
  boss: t => { osc('sawtooth', 72, t, 1.3, .35, 38); nz(t, 1.1, .28, 280); },
  pickup: t => { [660, 880, 1100].forEach((f, i) => osc('sine', f, t + i * .05, .1, .09)); },
  click: t => { osc('square', 640, t, .04, .05); },
  revive: t => { [392, 523, 659, 784].forEach((f, i) => osc('triangle', f, t + i * .1, .3, .14)); },
};
const MIN_GAP = { hit: .03, die: .035, gem: .025, shot: .04, flame: .16, coin: .06, zap: .05 };
const lastPlayed = {};
export function sfx(n) {
  if (!AC.ctx || save.muted) return;
  const now = AC.ctx.currentTime; if (now - (lastPlayed[n] || 0) < (MIN_GAP[n] || .02)) return;
  lastPlayed[n] = now; SFX[n](now);
}
const m2f = m => 440 * Math.pow(2, (m - 69) / 12);
let musNext = 0, musStep = 0;
export function music(time) {
  if (!AC.ctx || save.muted) return;
  const c = AC.ctx; if (musNext < c.currentTime) musNext = c.currentTime + .05;
  const stepLen = time > SOUND.lateAfter ? SOUND.tempoLate : SOUND.tempo, B = SOUND.bassline;
  while (musNext < c.currentTime + .15) {
    const s = musStep % B.length, tt = musNext;
    osc('triangle', m2f(B[s]), tt, stepLen * .9, .22, 0, AC.mus);
    if (s % 4 === 0) osc('sine', 110, tt, .18, .5, 40, AC.mus);
    if (s % 2 === 1) nz(tt, .04, .07, 7000, 'highpass', AC.mus);
    if (time > SOUND.melodyAfter && s % 4 === 2) osc('square', m2f(B[s] + 24), tt, .08, .04, 0, AC.mus);
    musNext += stepLen; musStep++;
  }
}
export function setMuted(m) { save.muted = m; persist(); if (AC.master) AC.master.gain.value = m ? 0 : SOUND.master; }
