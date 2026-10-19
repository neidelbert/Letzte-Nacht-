// Alle Figuren werden hier per Code gezeichnet (keine Bilder, keine Emojis).
// Farben kommen aus config/look.js und config/characters.js.
import { ctx } from '../engine/screen.js';
import { LOOK } from '../config/look.js';
import { CHARACTERS } from '../config/characters.js';

export const OUT = LOOK.outline;
const LW = 2.6, SC = 2;
export function rr(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
export function fs(g, fill, lw) { g.fillStyle = fill; g.fill(); g.lineWidth = lw || LW; g.strokeStyle = OUT; g.stroke(); }
export function circ(g, x, y, r) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); }
function mk(w, h, fn) { const c = document.createElement('canvas'); c.width = w * SC; c.height = h * SC; const g = c.getContext('2d'); g.scale(SC, SC); g.translate(w / 2, h / 2); g.lineJoin = 'round'; g.lineCap = 'round'; fn(g); return { c, w, h }; }
function white(s) { const c = document.createElement('canvas'); c.width = s.c.width; c.height = s.c.height; const g = c.getContext('2d'); g.drawImage(s.c, 0, 0); g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); return { c, w: s.w, h: s.h }; }
export function put(s, x, y, flip, scale) { const w = s.w * (scale || 1), h = s.h * (scale || 1); if (flip) { ctx.save(); ctx.translate(x, y); ctx.scale(-1, 1); ctx.drawImage(s.c, -w / 2, -h / 2, w, h); ctx.restore(); } else ctx.drawImage(s.c, x - w / 2, y - h / 2, w, h); }
function glowEye(g, x, y, r, col, blur) { g.save(); g.shadowColor = col; g.shadowBlur = blur || 6; g.fillStyle = col; circ(g, x, y, r); g.fill(); g.restore(); }

// Hüte der Charaktere – neuen Hut hier hinzufügen und in characters.js eintragen
export const HATS = {
  cowboy: g => { g.beginPath(); g.ellipse(1, -27, 16, 4.5, 0, 0, Math.PI * 2); fs(g, '#7a4a24'); rr(g, -7, -39, 16, 13, 5); fs(g, '#8b5a2e'); g.fillStyle = '#3b2414'; g.fillRect(-6, -30, 14, 3); },
  hardhat: g => { g.beginPath(); g.arc(1, -24, 11, Math.PI, 0); g.closePath(); fs(g, '#f2c230'); rr(g, -12, -25, 26, 4, 2); fs(g, '#e0aa1c'); rr(g, -1, -35, 4, 10, 2); g.fillStyle = '#e0aa1c'; g.fill(); rr(g, 1, -23, 9, 5, 2); fs(g, '#7fc6e8', 2); },
  mask: g => { g.beginPath(); g.arc(1, -21, 11, Math.PI * 1.05, Math.PI * -.05); fs(g, '#56603e'); circ(g, 6, -17, 6); fs(g, '#3a3f45'); circ(g, 6, -17, 3); g.fillStyle = '#8a929c'; g.fill(); circ(g, 4, -23, 3.2); fs(g, '#ff9a3a', 2); },
  medic: g => { rr(g, -9, -33, 20, 9, 4); fs(g, '#f4f2ec'); g.fillStyle = '#d8432f'; g.fillRect(-1, -31, 4, 6); g.fillRect(-3, -29, 8, 2); g.beginPath(); g.moveTo(-9, -25); g.quadraticCurveTo(-13, -14, -8, -8); g.lineTo(-7, -20); g.closePath(); fs(g, '#7a4a2a'); },
  beanie: g => { g.beginPath(); g.arc(1, -23, 10.5, Math.PI, 0); g.closePath(); fs(g, '#c23a2c'); rr(g, -10, -25, 22, 5, 2); fs(g, '#a52e22'); circ(g, 1, -35, 4); fs(g, '#f0e6d8'); g.beginPath(); g.moveTo(-6, -14); g.quadraticCurveTo(2, -4, 11, -13); g.lineTo(9, -17); g.lineTo(-4, -17); g.closePath(); fs(g, '#4a2e1c'); },
};
function drawHuman(g, o, f) {
  const a = f ? 3 : -3;
  rr(g, -8, 7, 7, 15 + a, 3); fs(g, o.pants); rr(g, 1, 7, 7, 15 - a, 3); fs(g, o.pants);
  rr(g, -9, 19 + a, 9, 5, 2); fs(g, '#2a2018'); rr(g, 0, 19 - a, 9, 5, 2); fs(g, '#2a2018');
  rr(g, -14, -6, 7, 14, 3.5); fs(g, o.skin);
  rr(g, -11, -10, 22, 21, 7); fs(g, o.shirt);
  g.fillStyle = 'rgba(255,255,255,.12)'; rr(g, -8, -8, 7, 15, 3); g.fill();
  g.fillStyle = '#3a2a1c'; g.fillRect(-10, 6, 20, 3);
  circ(g, 1, -19, 10); fs(g, o.skin);
  g.fillStyle = OUT; circ(g, 6, -20, 1.9); g.fill();
  g.strokeStyle = OUT; g.lineWidth = 1.6; g.beginPath(); g.moveTo(4, -14); g.lineTo(8, -14.5); g.stroke();
  (HATS[o.hat] || HATS.cowboy)(g);
  rr(g, 3, -3, 13, 6, 3); fs(g, o.skin);
  rr(g, 12, -6, 12, 5, 1.5); fs(g, '#3a3f4a', 2); rr(g, 12, -3, 4, 7, 1.5); fs(g, '#5b3a1e', 2);
}
function drawZombie(g, v, f) {
  const Z = LOOK.zombies[v], a = f ? 2.5 : -2.5;
  rr(g, -8, 7, 7, 15 + a, 3); fs(g, Z.pants); rr(g, 1, 7, 7, 15 - a, 3); fs(g, Z.pants);
  rr(g, -11, -9, 22, 20, 7); fs(g, Z.shirt);
  g.fillStyle = OUT; g.beginPath(); g.moveTo(-11, 6); g.lineTo(-6, 11); g.lineTo(-2, 6); g.lineTo(3, 11); g.lineTo(8, 6); g.lineTo(11, 10); g.lineTo(11, 12); g.lineTo(-11, 12); g.closePath(); g.fill();
  g.fillStyle = 'rgba(120,30,25,.6)'; circ(g, -3, -1, 3.5); g.fill();
  circ(g, 2, -18, 10); fs(g, Z.skin);
  g.fillStyle = 'rgba(0,0,0,.18)'; circ(g, -3, -14, 3); g.fill();
  glowEye(g, 7, -20, 2.3, LOOK.eyes); glowEye(g, 1.5, -20.5, 1.8, LOOK.eyes);
  g.strokeStyle = OUT; g.lineWidth = 1.8; g.beginPath(); g.moveTo(3, -13); g.lineTo(5, -12); g.lineTo(7, -13.5); g.lineTo(9, -12.5); g.stroke();
  rr(g, 2, -8 + a * .4, 20, 6, 3); fs(g, Z.skin); rr(g, -1, -3 - a * .4, 19, 6, 3); fs(g, Z.skin);
}
function drawDog(g, f) {
  const a = f ? 3 : -3, c = LOOK.dog.fur, c2 = LOOK.dog.dark;
  const leg = (pts, col) => { g.strokeStyle = OUT; g.lineWidth = 5; g.beginPath(); pts.forEach(p => { g.moveTo(p[0], p[1]); g.lineTo(p[2], p[3]); }); g.stroke(); g.strokeStyle = col; g.lineWidth = 2.6; g.stroke(); };
  leg([[-8, 6, -10 + a, 17], [8, 6, 10 - a, 17]], c2);
  g.beginPath(); g.moveTo(-17, -2); g.quadraticCurveTo(-26, -10, -24, -14); g.lineWidth = 5; g.strokeStyle = OUT; g.stroke(); g.lineWidth = 2.6; g.strokeStyle = c; g.stroke();
  g.beginPath(); g.ellipse(-2, 2, 18, 9, 0, 0, Math.PI * 2); fs(g, c);
  g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(-4, 6, 13, 3, 0, 0, Math.PI * 2); g.fill();
  leg([[-12, 7, -14 - a, 17], [4, 7, 5 + a, 17]], c);
  g.beginPath(); g.moveTo(10, -9); g.lineTo(13, -19); g.lineTo(17, -10); g.closePath(); fs(g, c2);
  circ(g, 15, -4, 8.5); fs(g, c);
  rr(g, 18, -4, 10, 6, 3); fs(g, LOOK.dog.snout);
  g.fillStyle = OUT; circ(g, 27, -2, 1.8); g.fill();
  glowEye(g, 17, -6, 2, LOOK.eyes);
  g.fillStyle = '#e9e3d6'; g.beginPath(); g.moveTo(20, 2); g.lineTo(21.5, 5); g.lineTo(23, 2); g.fill();
}
function drawBrute(g, f) {
  const a = f ? 3 : -3, B = LOOK.brute;
  rr(g, -16, 14, 12, 16 + a, 5); fs(g, B.pants); rr(g, 4, 14, 12, 16 - a, 5); fs(g, B.pants);
  rr(g, -30, -14, 14, 32, 7); fs(g, B.skin);
  rr(g, -22, -24, 46, 42, 16); fs(g, B.body);
  g.fillStyle = 'rgba(255,255,255,.1)'; rr(g, -17, -19, 12, 30, 6); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-5, -10); g.lineTo(8, 4); g.moveTo(2, -14); g.lineTo(-2, -6); g.stroke();
  circ(g, 8, -27, 11); fs(g, B.skin);
  glowEye(g, 13, -29, 2.6, LOOK.eyes, 7);
  g.strokeStyle = OUT; g.lineWidth = 2; g.beginPath(); g.moveTo(8, -21); g.lineTo(17, -22); g.stroke();
  rr(g, 14, -12, 16, 32, 7); fs(g, B.skin);
  rr(g, 16, 14, 14, 10, 5); fs(g, B.skin);
}
function drawBoss(g) {
  const B = LOOK.boss;
  rr(g, -30, 30, 20, 20, 7); fs(g, B.feet); rr(g, 10, 30, 20, 20, 7); fs(g, B.feet);
  rr(g, -58, -16, 24, 52, 11); fs(g, B.body); rr(g, 34, -16, 24, 52, 11); fs(g, B.body);
  rr(g, -40, -36, 80, 74, 26); fs(g, B.body);
  g.fillStyle = B.belly; rr(g, -22, -12, 44, 40, 16); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-14, 4); g.lineTo(14, 4); g.moveTo(-12, 16); g.lineTo(12, 16); g.stroke();
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(s * 26, -40); g.quadraticCurveTo(s * 46, -62, s * 36, -74); g.quadraticCurveTo(s * 30, -56, s * 14, -48); g.closePath(); fs(g, B.horns); }
  circ(g, 0, -40, 22); fs(g, B.body);
  glowEye(g, -8, -44, 4.5, B.eyes, 12); glowEye(g, 8, -44, 4.5, B.eyes, 12);
  g.fillStyle = OUT; rr(g, -10, -34, 20, 8, 3); g.fill();
  g.fillStyle = '#f0e6d0'; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-9 + i * 5, -34); g.lineTo(-6.5 + i * 5, -29); g.lineTo(-4 + i * 5, -34); g.fill(); }
  for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(s * (40 + i * 6), 36); g.lineTo(s * (42 + i * 6), 46); g.lineTo(s * (44 + i * 6), 36); fs(g, B.horns, 1.6); }
}
// Fledermäuse werden jedes Bild neu gezeichnet (Flügelschlag)
export function drawBat(x, y, flap, flash) {
  const w = Math.sin(flap) * 7;
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-18, -8 - w); ctx.lineTo(-14, -1 - w * .4); ctx.lineTo(-20, 3 - w * .2); ctx.lineTo(-9, 3); ctx.lineTo(9, 3); ctx.lineTo(20, 3 - w * .2); ctx.lineTo(14, -1 - w * .4); ctx.lineTo(18, -8 - w); ctx.lineTo(3, 0); ctx.closePath();
  ctx.fillStyle = flash ? '#fff' : LOOK.bat.wing; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = OUT; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 0, 6, 7, 0, 0, Math.PI * 2); ctx.fillStyle = flash ? '#fff' : LOOK.bat.body; ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-4, -5); ctx.lineTo(-3, -11); ctx.lineTo(-1, -6); ctx.moveTo(4, -5); ctx.lineTo(3, -11); ctx.lineTo(1, -6); ctx.fill(); ctx.stroke();
  if (!flash) { ctx.fillStyle = LOOK.eyes; ctx.beginPath(); ctx.arc(-2.2, -1.5, 1.4, 0, 7); ctx.arc(2.2, -1.5, 1.4, 0, 7); ctx.fill(); }
  ctx.restore();
}
export const SPR = {};
export function buildSprites() {
  SPR.z = LOOK.zombies.map((_, v) => [0, 1].map(f => mk(48, 58, g => drawZombie(g, v, f))));
  SPR.zw = SPR.z.map(a => a.map(white));
  SPR.dog = [0, 1].map(f => mk(64, 44, g => drawDog(g, f))); SPR.dogw = SPR.dog.map(white);
  SPR.brute = [0, 1].map(f => mk(76, 72, g => drawBrute(g, f))); SPR.brutew = SPR.brute.map(white);
  SPR.boss = mk(140, 150, drawBoss); SPR.bossw = white(SPR.boss);
  SPR.saw = mk(40, 40, g => { g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, r = i % 2 ? 13 : 18; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); fs(g, '#cfd5de'); circ(g, 0, 0, 7); fs(g, '#8a929e'); circ(g, 0, 0, 2.5); g.fillStyle = OUT; g.fill(); });
  SPR.chars = {}; CHARACTERS.forEach(c => { SPR.chars[c.id] = [0, 1].map(f => mk(52, 62, g => drawHuman(g, c.look, f))); });
}
