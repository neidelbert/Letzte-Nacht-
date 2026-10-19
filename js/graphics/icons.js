// Kleine gezeichnete Symbole für Menüs und Upgrade-Karten
import { OUT, rr, fs, circ, SPR } from './sprites.js';

const ICONS = {};
const ICON_BG = {
  revolver: '#3a3346', shotgun: '#3a3346', flamer: '#4a2f22', boomerang: '#3d3a26', saws: '#2c3a46', zap: '#2c3352', grenade: '#2f3d2a', aura: '#26402e',
  might: '#4a2626', haste: '#2c3352', boots: '#26394a', heart: '#4a2632', magnet: '#3e2a2a', regen: '#244030', armor: '#2f3644', area: '#3a3046',
  vital: '#4a2632', speed: '#26394a', greed: '#4a3d1e', revive: '#4a3d1e', coin: null,
};
function heartPath(g, s) { g.beginPath(); g.moveTo(0, s * .7); g.bezierCurveTo(-s * 1.2, -s * .1, -s * .7, -s * 1.05, 0, -s * .45); g.bezierCurveTo(s * .7, -s * 1.05, s * 1.2, -s * .1, 0, s * .7); g.closePath(); }
const PAINT = {
  revolver: g => { rr(g, -18, -11, 32, 9, 3); fs(g, '#c9ced8'); circ(g, -4, -4, 7); fs(g, '#9aa1ad'); g.beginPath(); g.moveTo(-18, -4); g.lineTo(-10, -4); g.lineTo(-6, 16); g.lineTo(-16, 16); g.closePath(); fs(g, '#8b5a2e'); },
  shotgun: g => { rr(g, -22, -9, 44, 7, 3); fs(g, '#9aa1ad'); rr(g, -6, -2, 22, 6, 3); fs(g, '#6b4a2b'); g.beginPath(); g.moveTo(-22, -3); g.lineTo(-10, -3); g.lineTo(-16, 14); g.lineTo(-26, 10); g.closePath(); fs(g, '#8b5a2e'); },
  flamer: g => { g.beginPath(); g.moveTo(0, -24); g.bezierCurveTo(16, -6, 16, 20, 0, 20); g.bezierCurveTo(-16, 20, -16, -2, 0, -24); fs(g, '#ff7b2a'); g.beginPath(); g.moveTo(0, -6); g.bezierCurveTo(9, 4, 8, 16, 0, 16); g.bezierCurveTo(-8, 16, -8, 6, 0, -6); g.fillStyle = '#ffd84a'; g.fill(); },
  boomerang: g => { g.beginPath(); g.moveTo(-18, 14); g.lineTo(0, -14); g.lineTo(18, 14); g.lineWidth = 15; g.strokeStyle = OUT; g.stroke(); g.lineWidth = 9; g.strokeStyle = '#c9893f'; g.stroke(); },
  saws: g => { g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = i % 2 ? 15 : 21; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); fs(g, '#cfd5de'); circ(g, 0, 0, 7); fs(g, '#8a929e'); },
  zap: g => { g.beginPath(); g.moveTo(6, -24); g.lineTo(-12, 4); g.lineTo(0, 4); g.lineTo(-6, 24); g.lineTo(14, -6); g.lineTo(2, -6); g.closePath(); fs(g, '#ffd84a'); },
  grenade: g => { g.beginPath(); g.ellipse(0, 4, 14, 17, 0, 0, Math.PI * 2); fs(g, '#5d7a40'); rr(g, -6, -18, 12, 7, 2); fs(g, '#9aa1ad'); circ(g, 10, -18, 5); g.lineWidth = 3; g.strokeStyle = '#cfd5de'; g.stroke(); g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-14, 4); g.lineTo(14, 4); g.moveTo(0, -13); g.lineTo(0, 21); g.stroke(); },
  aura: g => { for (let i = 3; i >= 1; i--) { circ(g, 0, 0, i * 8); g.fillStyle = `rgba(123,214,107,${.18 * i})`; g.fill(); g.lineWidth = 2.5; g.strokeStyle = '#7bd66b'; g.stroke(); } },
  might: g => { g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = i % 2 ? 10 : 23; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); fs(g, '#ff6a3a'); circ(g, 0, 0, 7); g.fillStyle = '#ffd84a'; g.fill(); },
  haste: g => { circ(g, 0, 2, 18); fs(g, '#f0ece2'); g.strokeStyle = OUT; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 2); g.lineTo(0, -9); g.moveTo(0, 2); g.lineTo(8, 6); g.stroke(); rr(g, -4, -22, 8, 6, 2); fs(g, '#9aa1ad'); },
  boots: g => { for (const o of [-9, 7]) { g.beginPath(); g.moveTo(o - 8, -14); g.lineTo(o + 6, 0); g.lineTo(o - 8, 14); g.lineWidth = 10; g.strokeStyle = OUT; g.stroke(); g.lineWidth = 5; g.strokeStyle = '#5fb4ff'; g.stroke(); } },
  heart: g => { heartPath(g, 22); fs(g, '#e2453a'); g.fillStyle = 'rgba(255,255,255,.35)'; circ(g, -8, -8, 4); g.fill(); },
  magnet: g => { g.beginPath(); g.arc(0, -2, 14, Math.PI, 0, true); g.lineWidth = 16; g.strokeStyle = OUT; g.stroke(); g.lineWidth = 10; g.strokeStyle = '#d8432f'; g.stroke(); g.fillStyle = '#cfd5de'; g.fillRect(-19, -6, 10, 9); g.fillRect(9, -6, 10, 9); g.strokeStyle = OUT; g.lineWidth = 2.5; g.strokeRect(-19, -6, 10, 9); g.strokeRect(9, -6, 10, 9); },
  regen: g => { rr(g, -6, -20, 12, 40, 3); fs(g, '#5fd27a'); rr(g, -20, -6, 40, 12, 3); fs(g, '#5fd27a'); g.fillStyle = '#5fd27a'; g.fillRect(-4.5, -4.5, 9, 9); },
  armor: g => { g.beginPath(); g.moveTo(0, -22); g.lineTo(18, -14); g.quadraticCurveTo(18, 12, 0, 22); g.quadraticCurveTo(-18, 12, -18, -14); g.closePath(); fs(g, '#8aa0b8'); g.fillStyle = 'rgba(255,255,255,.25)'; g.beginPath(); g.moveTo(0, -17); g.lineTo(0, 17); g.quadraticCurveTo(-13, 9, -13, -11); g.closePath(); g.fill(); },
  area: g => { circ(g, 0, 0, 20); g.setLineDash([5, 5]); g.lineWidth = 3; g.strokeStyle = '#c9a8ff'; g.stroke(); g.setLineDash([]); circ(g, 0, 0, 7); fs(g, '#c9a8ff'); },
  greed: g => { circ(g, 4, 6, 15); fs(g, '#c98a1c'); circ(g, -3, -2, 15); fs(g, '#f2b94a'); g.fillStyle = '#c98a1c'; g.font = '700 16px Rubik,sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('G', -3, -1); },
  revive: g => { heartPath(g, 22); fs(g, '#f2b94a'); g.fillStyle = '#fff'; g.fillRect(-2, -12, 4, 14); g.fillRect(-7, -7, 14, 4); },
  coin: g => { circ(g, 0, 0, 20); fs(g, '#f2b94a', 3); circ(g, 0, 0, 12); g.lineWidth = 3; g.strokeStyle = '#c98a1c'; g.stroke(); g.fillStyle = 'rgba(255,255,255,.5)'; circ(g, -7, -8, 4); g.fill(); },
};
PAINT.vital = PAINT.heart; PAINT.speed = PAINT.boots;

export function icon(id) {
  if (ICONS[id]) return ICONS[id];
  const c = document.createElement('canvas'); c.width = c.height = 96; const g = c.getContext('2d');
  g.scale(96 / 72, 96 / 72); g.translate(36, 36); g.lineJoin = 'round'; g.lineCap = 'round';
  if (ICON_BG[id] !== null) { circ(g, 0, 0, 34); g.fillStyle = ICON_BG[id] || '#2a2f3d'; g.fill(); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.12)'; g.stroke(); }
  (PAINT[id] || (() => {}))(g);
  return ICONS[id] = c.toDataURL();
}
export function portrait(id) {
  const k = 'p_' + id; if (ICONS[k]) return ICONS[k];
  const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d');
  g.fillStyle = '#2b3040'; circ(g, 80, 80, 78); g.fill();
  const s = SPR.chars[id][0]; g.drawImage(s.c, 80 - s.w * 1.15, 84 - s.h * 1.15, s.w * 2.3, s.h * 2.3);
  return ICONS[k] = c.toDataURL();
}
