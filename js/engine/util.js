// Kleine Hilfsfunktionen, die überall gebraucht werden
export const $ = id => document.getElementById(id);
export const rnd = (a, b) => a + Math.random() * (b - a);
export const ri = (a, b) => Math.floor(rnd(a, b + 1));
export const angDiff = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
// Wert für eine Stufe aus einer Liste holen ([a,b,c] oder einzelne Zahl)
export const lv = (v, level) => Array.isArray(v) ? v[Math.min(v.length, Math.max(1, level)) - 1] : v;
export function fmtTime(s) { s = Math.floor(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
// Effekt aus den Einstellungsdateien anwenden ({stat, op, value})
export function applyMod(S, m, times = 1) {
  for (let i = 0; i < times; i++) { if (m.op === 'mul') S[m.stat] *= m.value; else S[m.stat] += m.value; }
}
// Zufallsgenerator mit festem Startwert (für den Boden)
export function mulberry(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
