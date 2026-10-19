// Alles auf den Bildschirm malen (Reihenfolge = Ebenen von unten nach oben)
import { G } from './state.js';
import { BALANCE } from '../config/balance.js';
import { WEAPONS } from '../config/weapons.js';
import { LOOK } from '../config/look.js';
import { ctx, view, reduceMotion } from '../engine/screen.js';
import { joy } from '../engine/input.js';
import { rnd, lv } from '../engine/util.js';
import { SPR, OUT, put, rr, drawBat } from '../graphics/sprites.js';
import { drawGround } from '../graphics/ground.js';
import { lighting } from '../graphics/lighting.js';

function shadow(x, y, rx, ry) { ctx.fillStyle = 'rgba(0,0,0,.38)'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }

export function draw() {
  const P = G.P, S = G.S, t = G.t, VW = view.w, VH = view.h;
  const sx = reduceMotion ? 0 : rnd(-G.shake, G.shake), sy = reduceMotion ? 0 : rnd(-G.shake, G.shake);
  const camX = P.x - sx, camY = P.y - sy, cx = VW / 2 - camX, cy = VH / 2 - camY;
  const vis = (x, y, m) => x + cx > -m && y + cy > -m && x + cx < VW + m && y + cy < VH + m;
  drawGround(camX, camY);

  // Blut und Brandflecken
  for (const d of G.decals) { if (!vis(d.x, d.y, 60) || d.a <= 0) continue; ctx.save(); ctx.translate(d.x + cx, d.y + cy); ctx.rotate(d.rot); ctx.fillStyle = d.scorch ? `rgba(10,10,10,${d.a})` : `rgba(90,18,14,${d.a})`; ctx.beginPath(); ctx.ellipse(0, 0, d.r, d.r * .55, 0, 0, Math.PI * 2); ctx.fill(); if (!d.scorch) { ctx.beginPath(); ctx.arc(d.r * .9, d.r * .2, d.r * .2, 0, 7); ctx.fill(); } ctx.restore(); }
  // Giftwolke
  if (G.W.aura) { const R = lv(WEAPONS.aura.radius, G.W.aura.lvl) * S.area + (reduceMotion ? 0 : Math.sin(t * 4) * 4);
    const g = ctx.createRadialGradient(P.x + cx, P.y + cy, R * .2, P.x + cx, P.y + cy, R); g.addColorStop(0, 'rgba(110,210,90,.05)'); g.addColorStop(.85, 'rgba(110,210,90,.2)'); g.addColorStop(1, 'rgba(110,210,90,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(P.x + cx, P.y + cy, R, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(140,230,110,.35)'; ctx.lineWidth = 2; ctx.stroke(); }
  // Kristalle, Gold, Fundstücke
  for (const g of G.gems) { if (!vis(g.x, g.y, 10)) continue; const x = g.x + cx, y = g.y + cy, s = g.v >= 5 ? 7.5 : g.v >= 2 ? 6 : 5;
    ctx.fillStyle = g.v >= 5 ? LOOK.gems.big : g.v >= 2 ? LOOK.gems.mid : LOOK.gems.small; ctx.strokeStyle = OUT; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s * .75, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s * .75, y); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x - 1.5, y - s * .55, 2, s * .5); }
  for (const c of G.coins) { if (!vis(c.x, c.y, 10)) continue; const sq = Math.abs(Math.cos(t * 5 + c.x));
    ctx.fillStyle = LOOK.coin; ctx.strokeStyle = OUT; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(c.x + cx, c.y + cy, 6 * Math.max(.25, sq), 6, 0, 0, 7); ctx.fill(); ctx.stroke(); }
  for (const d of G.drops) { const x = d.x + cx, y = d.y + cy + Math.sin(t * 4) * 3; shadow(x, d.y + cy + 12, 10, 3); ctx.lineWidth = 2.2; ctx.strokeStyle = OUT;
    if (d.k === 'heal') { rr(ctx, x - 11, y - 9, 22, 18, 4); ctx.fillStyle = '#f0ece2'; ctx.fill(); ctx.stroke(); ctx.fillStyle = '#d8432f'; ctx.fillRect(x - 2.5, y - 6, 5, 12); ctx.fillRect(x - 6, y - 2.5, 12, 5); }
    if (d.k === 'magnet') { ctx.beginPath(); ctx.arc(x, y - 1, 8, Math.PI, 0, true); ctx.lineWidth = 9; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#d8432f'; ctx.stroke(); ctx.fillStyle = '#cfd5de'; ctx.fillRect(x - 10.5, y - 3, 5, 5); ctx.fillRect(x + 5.5, y - 3, 5, 5); }
    if (d.k === 'bomb') { ctx.beginPath(); ctx.arc(x, y + 2, 9, 0, 7); ctx.fillStyle = '#2a2d36'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + 5, y - 5); ctx.quadraticCurveTo(x + 10, y - 12, x + 13, y - 10); ctx.stroke(); ctx.fillStyle = Math.sin(t * 20) > 0 ? '#ffd84a' : '#ff6a2a'; ctx.beginPath(); ctx.arc(x + 13, y - 10, 2.5, 0, 7); ctx.fill(); } }

  // Figuren, nach Höhe sortiert (wer weiter unten steht, ist vorne)
  const list = G.enemies.filter(e => vis(e.x, e.y, 90)); list.push(P); list.sort((a, b) => a.y - b.y);
  for (const e of list) {
    if (e === P) { const x = P.x + cx, y = P.y + cy; shadow(x, y + 20, 14, 5);
      const fr = P.moving ? Math.floor(P.step) % 2 : 0;
      if (!(P.inv > 0 && Math.floor(t * 20) % 2)) put(SPR.chars[G.char.id][fr], x, y - 4 - (P.moving ? Math.abs(Math.sin(P.step * Math.PI / 2)) * 1.5 : 0), P.face < 0);
      const w = 38; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(x - w / 2, y + 26, w, 5); ctx.fillStyle = P.hp / S.max < .3 ? '#ff5a42' : '#7be08a'; ctx.fillRect(x - w / 2, y + 26, w * Math.max(0, P.hp) / S.max, 5);
      continue; }
    const x = e.x + cx, y = e.y + cy, fl = e.flash > 0, fr = Math.floor(t * 6 + e.wob) % 2, flip = e.x > P.x;
    if (e.type === 'walker') { shadow(x, y + 19, 13, 4.5); put((fl ? SPR.zw : SPR.z)[e.v % SPR.z.length][fr], x, y - 4 + Math.sin(t * 6 + e.wob) * 1.2, flip); }
    else if (e.type === 'dog') { shadow(x, y + 15, 16, 4.5); put((fl ? SPR.dogw : SPR.dog)[fr], x, y - 2, flip); }
    else if (e.type === 'brute') { shadow(x, y + 28, 24, 7); put((fl ? SPR.brutew : SPR.brute)[fr], x, y - 6, flip); }
    else if (e.type === 'bat') { shadow(x, y + 18, 9, 3); drawBat(x, y - 6, t * 22 + e.wob, fl); }
    else if (e.type === 'boss') { shadow(x, y + 44, 46, 12); put(fl ? SPR.bossw : SPR.boss, x, y - 16 + Math.sin(t * 3) * 2, flip);
      const w = 110; ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(x - w / 2, y - 98, w, 8); ctx.fillStyle = '#ff5a42'; ctx.fillRect(x - w / 2, y - 98, w * e.hp / e.max, 8); }
  }
  // Waffen-Effekte
  if (G.W.saws) { const C = WEAPONS.saws, n = lv(C.count, G.W.saws.lvl), R = C.radius * S.area;
    for (let i = 0; i < n; i++) { const a = G.sawAng + i * Math.PI * 2 / n; ctx.save(); ctx.translate(P.x + Math.cos(a) * R + cx, P.y + Math.sin(a) * R + cy); ctx.rotate(t * 16); ctx.drawImage(SPR.saw.c, -20, -20, 40, 40); ctx.restore(); } }
  for (const b of G.booms) { ctx.save(); ctx.translate(b.x + cx, b.y + cy); ctx.rotate(b.rot); ctx.beginPath(); ctx.moveTo(-11, 8); ctx.lineTo(0, -9); ctx.lineTo(11, 8); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 9; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 5; ctx.strokeStyle = '#c9893f'; ctx.stroke(); ctx.restore(); }
  for (const n of G.nades) { const k = Math.min(1, n.k), x = n.sx + (n.tx - n.sx) * k + cx, y = n.sy + (n.ty - n.sy) * k + cy, h = Math.sin(k * Math.PI) * 70;
    shadow(x, y + 4, 6 * (1 - h / 140), 2.5); ctx.beginPath(); ctx.ellipse(x, y - h, 6, 7, k * 10, 0, 7); ctx.fillStyle = '#5d7a40'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = OUT; ctx.stroke(); }
  ctx.globalCompositeOperation = 'lighter';
  for (const f of G.fires) { const k = f.life / f.max; ctx.fillStyle = k > .6 ? `rgba(255,230,140,${k * .7})` : k > .3 ? `rgba(255,140,50,${k * .8})` : `rgba(200,60,30,${k})`; ctx.beginPath(); ctx.arc(f.x + cx, f.y + cy, f.r * (1.6 - k), 0, 7); ctx.fill(); }
  ctx.globalCompositeOperation = 'source-over';
  for (const b of G.bullets) { const x = b.x + cx, y = b.y + cy, s = Math.hypot(b.vx, b.vy);
    ctx.strokeStyle = 'rgba(255,220,150,.45)'; ctx.lineWidth = b.r * 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - b.vx / s * 14, y - b.vy / s * 14); ctx.stroke();
    ctx.fillStyle = b.col; ctx.beginPath(); ctx.arc(x, y, b.r, 0, 7); ctx.fill(); }
  for (const b of G.bolts) { ctx.strokeStyle = `rgba(180,225,255,${b.life / .18})`; ctx.lineWidth = 3.5; ctx.shadowColor = '#7fc8ff'; ctx.shadowBlur = 10; ctx.beginPath();
    b.pts.forEach((p, i) => { const x = p[0] + cx, y = p[1] + cy; if (!i) ctx.moveTo(x, y); else { const q = b.pts[i - 1]; ctx.lineTo((q[0] + p[0]) / 2 + cx + rnd(-12, 12), (q[1] + p[1]) / 2 + cy + rnd(-12, 12)); ctx.lineTo(x, y); } }); ctx.stroke(); ctx.shadowBlur = 0; }
  for (const p of G.parts) { const k = Math.max(0, p.life / p.max); ctx.globalAlpha = k;
    if (p.ring) { ctx.strokeStyle = p.col; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.x + cx, p.y + cy, p.ring * (1 - k * .6), 0, 7); ctx.stroke(); }
    else { if (p.glow) ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x + cx, p.y + cy, p.r, 0, 7); ctx.fill(); ctx.globalCompositeOperation = 'source-over'; } }
  ctx.globalAlpha = 1;

  // Licht und Dunkelheit
  const fl = reduceMotion ? 0 : Math.sin(t * 9) * .03 + Math.sin(t * 23) * .02;
  const L = [{ x: P.x, y: P.y, r: BALANCE.light.playerRadius, a: 1, warm: true }];
  if (G.W.flamer && G.W.flamer.on) L.push({ x: P.x + Math.cos(G.W.flamer.aim) * 80, y: P.y + Math.sin(G.W.flamer.aim) * 80, r: 170, a: .9, warm: true });
  for (const l of G.lights) L.push({ x: l.x, y: l.y, r: l.r, a: Math.min(1, l.life / l.max + .2), warm: l.warm });
  for (const e of G.enemies) if (e.type === 'boss') L.push({ x: e.x, y: e.y - 50, r: 80, a: .5 });
  lighting(cx, cy, L, BALANCE.light.darkness + fl);

  // Schadenszahlen, Warnung bei wenig Leben, Joystick
  ctx.font = '700 15px Rubik, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (const x of G.texts) { ctx.globalAlpha = Math.min(1, x.life * 2); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.strokeText(x.v, x.x + cx, x.y + cy); ctx.fillStyle = x.col; ctx.fillText(x.v, x.x + cx, x.y + cy); }
  ctx.globalAlpha = 1;
  const low = P.hp / S.max < .3;
  if (G.hurt > 0 || low) {
    const v = Math.max(G.hurt * .45, low ? .22 + (reduceMotion ? 0 : Math.sin(t * 5) * .06) : 0);
    const rg = ctx.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * .3, VW / 2, VH / 2, Math.max(VW, VH) * .7);
    rg.addColorStop(0, 'rgba(200,20,10,0)'); rg.addColorStop(1, `rgba(200,20,10,${v})`); ctx.fillStyle = rg; ctx.fillRect(0, 0, VW, VH);
  }
  if (joy.on && G.state === 'play') { ctx.globalAlpha = .22; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(joy.bx, joy.by, joy.max, 0, 7); ctx.fill(); ctx.globalAlpha = .5; ctx.beginPath(); ctx.arc(joy.x, joy.y, 24, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
}
export function drawMenuBG(dt) {
  G.menuT += dt; const camX = G.menuT * 22, camY = Math.sin(G.menuT * .1) * 60;
  drawGround(camX, camY);
  lighting(view.w / 2 - camX, view.h / 2 - camY, [{ x: camX, y: camY - view.h * .12, r: Math.min(view.w, view.h) * .7, a: .85, warm: true }], .66);
}
