// Gegner erzeugen, treffen, besiegen, Explosionen
import { G } from './state.js';
import { BALANCE } from '../config/balance.js';
import { ENEMIES, BOSS } from '../config/enemies.js';
import { TEXT } from '../config/texts.js';
import { view } from '../engine/screen.js';
import { sfx } from '../engine/audio.js';
import { rnd, ri } from '../engine/util.js';
import { banner } from '../ui/hud.js';

export function spawn(type) {
  const def = type === 'boss' ? BOSS : ENEMIES[type], B = BALANCE.enemyScaling;
  const a = Math.random() * Math.PI * 2, R = Math.hypot(view.w, view.h) / 2 + 70;
  const hp = Math.round(def.hp * (type === 'boss' ? 1 + G.t / B.bossHpDoublesEvery : 1 + G.t / B.hpDoublesEvery));
  G.enemies.push({ type, def, x: G.P.x + Math.cos(a) * R, y: G.P.y + Math.sin(a) * R, r: def.radius, hp, max: hp,
    spd: def.speed * (1 + Math.min(B.speedBonusMax, G.t / B.speedBonusEvery)), dmg: def.damage, xp: def.xp,
    v: ri(0, 2), flash: 0, sawCd: 0, wob: Math.random() * 6 });
  if (type === 'boss') { sfx('boss'); banner(TEXT.bossComing); }
}
export function pickType() {
  const list = Object.entries(ENEMIES).filter(([, e]) => G.t >= e.appearsAfter);
  let r = Math.random() * list.reduce((s, [, e]) => s + e.weight, 0);
  for (const [id, e] of list) { if (r < e.weight) return id; r -= e.weight; }
  return list[0][0];
}
export function hitEnemy(e, dmg, kx, ky, col) {
  if (e.hp <= 0) return;
  dmg *= G.S.dmgMul; e.hp -= dmg; e.flash = .08;
  if (e.type !== 'boss') { const k = 1 - (e.def.knockbackResist || 0); e.x += kx * k; e.y += ky * k; }
  if (G.texts.length < 70) G.texts.push({ x: e.x + rnd(-6, 6), y: e.y - e.r, v: Math.round(dmg), life: .6, col: col || '#fff' });
  sfx('hit');
  if (e.hp <= 0) killEnemy(e);
}
export function killEnemy(e) {
  const i = G.enemies.indexOf(e); if (i < 0) return; G.enemies.splice(i, 1); G.kills++;
  const big = e.type === 'boss', D = BALANCE.drops;
  for (let k = 0; k < (big ? 40 : 7); k++) { const a = Math.random() * 6.28, s = rnd(60, big ? 380 : 220); G.parts.push({ x: e.x, y: e.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(.3, .7), max: .7, col: Math.random() < .6 ? '#6b241d' : '#a83a2a', r: rnd(2, big ? 6 : 4) }); }
  G.decals.push({ x: e.x, y: e.y + e.r * .5, r: e.r * (big ? 1.6 : .9) * rnd(.8, 1.2), a: .55, rot: Math.random() * 3 });
  if (G.decals.length > 140) G.decals.shift();
  sfx('die');
  if (G.kills % 100 === 0) banner(G.kills + ' ' + TEXT.kills + '!');
  if (big) {
    for (let k = 0; k < D.bossGems; k++) G.gems.push({ x: e.x + rnd(-50, 50), y: e.y + rnd(-50, 50), v: 5 });
    for (let k = 0; k < D.bossCoins; k++) G.coins.push({ x: e.x + rnd(-60, 60), y: e.y + rnd(-60, 60), v: 2 });
    G.drops.push({ x: e.x, y: e.y, k: 'heal' }); banner(TEXT.bossDead); G.shake = 14; return;
  }
  G.gems.push({ x: e.x, y: e.y, v: e.xp });
  if (Math.random() < D.coinChance) G.coins.push({ x: e.x + rnd(-8, 8), y: e.y + rnd(-8, 8), v: e.type === 'brute' ? 3 : 1 });
  const r = Math.random();
  if (r < D.healChance) G.drops.push({ x: e.x, y: e.y, k: 'heal' });
  else if (r < D.healChance + D.magnetChance) G.drops.push({ x: e.x, y: e.y, k: 'magnet' });
  else if (r < D.healChance + D.magnetChance + D.bombChance) G.drops.push({ x: e.x, y: e.y, k: 'bomb' });
}
export function nearest(x, y, maxD, skip) {
  let best = null, bd = maxD;
  for (const e of G.enemies) { if (skip && skip.has(e)) continue; const d = Math.hypot(e.x - x, e.y - y); if (d < bd) { bd = d; best = e; } }
  return best;
}
export function explode(x, y, R, dmg) {
  for (let k = 0; k < 18; k++) { const a = Math.random() * 6.28, s = rnd(90, 260); G.parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rnd(.25, .45), max: .45, col: Math.random() < .5 ? '#ffb347' : '#ff6a2a', r: rnd(3, 6), glow: true }); }
  G.parts.push({ x, y, vx: 0, vy: 0, life: .22, max: .22, ring: R, col: '#ffd27a' });
  G.lights.push({ x, y, r: R * 2.6, life: .3, max: .3, warm: true });
  G.decals.push({ x, y, r: R * .55, a: .5, rot: 0, scorch: true }); if (G.decals.length > 140) G.decals.shift();
  G.shake = Math.max(G.shake, 7); sfx('boom');
  for (const e of [...G.enemies]) { const d = Math.hypot(e.x - x, e.y - y); if (d < R + e.r) hitEnemy(e, dmg, (e.x - x) / (d || 1) * 10, (e.y - y) / (d || 1) * 10, '#ffd27a'); }
}
