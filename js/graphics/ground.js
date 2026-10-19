// Der Friedhof-Boden: wird in Kacheln zufällig, aber immer gleich erzeugt
import { ctx, view } from '../engine/screen.js';
import { LOOK } from '../config/look.js';
import { OUT, circ } from './sprites.js';
import { mulberry } from '../engine/util.js';

const CHUNK = 256, chunks = new Map();
function grave(g, x, y, r) {
  const L = LOOK.ground;
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x + 3, y + 2, 13, 4, 0, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(x - 9, y); g.lineTo(x - 9, y - 15); g.arc(x, y - 15, 9, Math.PI, 0); g.lineTo(x + 9, y); g.closePath();
  g.fillStyle = r() < .5 ? L.graveA : L.graveB; g.fill(); g.lineWidth = 2.2; g.strokeStyle = OUT; g.stroke();
  g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(x - 7, y - 18, 3, 15);
  g.strokeStyle = 'rgba(20,22,30,.7)'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(x, y - 20); g.lineTo(x, y - 8); g.moveTo(x - 4, y - 16); g.lineTo(x + 4, y - 16); g.stroke();
  g.fillStyle = 'rgba(60,90,60,.6)'; g.beginPath(); g.ellipse(x, y, 11, 2.5, 0, 0, Math.PI * 2); g.fill();
}
function tree(g, x, y, r) {
  g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(x + 4, y + 2, 16, 5, 0, 0, Math.PI * 2); g.fill();
  const br = (x1, y1, a, len, w, d) => {
    if (d <= 0 || len < 4) return; const x2 = x1 + Math.cos(a) * len, y2 = y1 + Math.sin(a) * len;
    g.strokeStyle = OUT; g.lineWidth = w + 2.4; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
    g.strokeStyle = LOOK.ground.tree; g.lineWidth = w; g.stroke();
    br(x2, y2, a - .45 - r() * .3, len * .68, w * .62, d - 1); br(x2, y2, a + .4 + r() * .3, len * .66, w * .62, d - 1);
  };
  g.lineCap = 'round'; br(x, y, -Math.PI / 2 + (r() - .5) * .3, 26, 6, 4);
}
function chunk(cx, cy) {
  const k = cx + ',' + cy; let c = chunks.get(k); if (c) return c;
  if (chunks.size > 70) chunks.delete(chunks.keys().next().value);
  c = document.createElement('canvas'); c.width = c.height = CHUNK; const g = c.getContext('2d'), L = LOOK.ground, S = CHUNK;
  const r = mulberry(Math.imul(cx, 928371) ^ Math.imul(cy, 19349663) ^ 1234567);
  g.fillStyle = L.base; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 7; i++) { g.fillStyle = r() < .5 ? L.patchLight : L.patchDark; g.beginPath(); g.ellipse(r() * S, r() * S, 24 + r() * 50, 14 + r() * 28, r() * 3, 0, Math.PI * 2); g.fill(); }
  if (r() < .4) { g.fillStyle = L.dirt; g.beginPath(); g.ellipse(40 + r() * (S - 80), 40 + r() * (S - 80), 30 + r() * 36, 16 + r() * 18, r() * 3, 0, Math.PI * 2); g.fill(); }
  g.lineWidth = 1.3; for (let i = 0; i < 90; i++) { const x = r() * S, y = r() * S; g.strokeStyle = r() < .5 ? L.grassA : L.grassB; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .5) * 4, y - 3 - r() * 5); g.stroke(); }
  for (let i = 0; i < 6; i++) { g.fillStyle = L.stone; g.beginPath(); g.ellipse(r() * S, r() * S, 2 + r() * 3, 1.5 + r() * 2, 0, 0, Math.PI * 2); g.fill(); }
  if (r() < .25) { g.fillStyle = 'rgba(190,200,120,.5)'; for (let i = 0; i < 4; i++) { circ(g, r() * S, r() * S, 1.6); g.fill(); } }
  const ng = r() < L.graveChance ? 1 + Math.floor(r() * 3) : 0; for (let i = 0; i < ng; i++) grave(g, 26 + r() * (S - 52), 34 + r() * (S - 52), r);
  if (r() < L.treeChance) tree(g, 40 + r() * (S - 80), 60 + r() * (S - 80), r);
  chunks.set(k, c); return c;
}
export function drawGround(camX, camY) {
  const ox = camX - view.w / 2, oy = camY - view.h / 2;
  const x0 = Math.floor(ox / CHUNK), y0 = Math.floor(oy / CHUNK), x1 = Math.floor((ox + view.w) / CHUNK), y1 = Math.floor((oy + view.h) / CHUNK);
  for (let cx = x0; cx <= x1; cx++) for (let cy = y0; cy <= y1; cy++) ctx.drawImage(chunk(cx, cy), Math.floor(cx * CHUNK - ox), Math.floor(cy * CHUNK - oy), CHUNK + 1, CHUNK + 1);
}
