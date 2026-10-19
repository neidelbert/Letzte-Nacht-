// Ein Spielschritt: Bewegung, Gegner, Treffer, Einsammeln
import { G } from './state.js';
import { BALANCE } from '../config/balance.js';
import { TEXT } from '../config/texts.js';
import { WEAPONS } from '../config/weapons.js';
import { readInput } from '../engine/input.js';
import { sfx, AC } from '../engine/audio.js';
import { shopLv } from '../engine/save.js';
import { spawn, pickType, hitEnemy, killEnemy, explode } from './combat.js';
import { updWeapons } from './weapons.js';
import { collect, useDrop } from './progress.js';
import { banner } from '../ui/hud.js';
import { gameOver } from '../ui/menus.js';

export function update(dt) {
  const P = G.P, S = G.S, B = BALANCE;
  G.t += dt;
  const [mx, my] = readInput();
  P.x += mx * S.speed * dt; P.y += my * S.speed * dt; P.moving = !!(mx || my);
  if (mx && !(G.W.flamer && G.W.flamer.on)) P.face = mx < 0 ? -1 : 1;
  if (P.moving) P.step += dt * 9;
  P.inv = Math.max(0, P.inv - dt);
  if (S.regen) P.hp = Math.min(S.max, P.hp + S.regen * dt);
  G.gemComboT -= dt; if (G.gemComboT <= 0) AC.gemCombo = 0;

  // Gegner erscheinen
  const sp = B.spawn, rate = Math.min(sp.maxPerSecond, sp.startPerSecond + G.t * sp.risePerSecond + Math.pow(G.t / sp.curveEvery, sp.curvePower));
  G.spawnAcc += rate * dt;
  while (G.spawnAcc >= 1) { G.spawnAcc--; if (G.enemies.length < sp.maxEnemies) spawn(pickType()); }
  if (G.t >= G.nextBoss) { G.nextBoss += B.boss.every; spawn('boss'); }
  if (G.t > B.batSwarm.after && Math.random() < dt * B.batSwarm.chancePerSecond) { for (let i = 0; i < B.batSwarm.size; i++) spawn('bat'); banner(TEXT.swarm); }

  updWeapons(dt);

  // Gegner laufen auf dich zu
  for (const e of G.enemies) {
    const dx = P.x - e.x, dy = P.y - e.y, d = Math.hypot(dx, dy) || 1;
    const wob = e.def.zigzag ? Math.sin(G.t * 8 + e.wob) * e.def.zigzag : 0;
    e.x += (dx / d + (-dy / d) * wob) * e.spd * dt; e.y += (dy / d + (dx / d) * wob) * e.spd * dt;
    e.flash = Math.max(0, e.flash - dt); e.sawCd -= dt;
    if (d < e.r + P.r && P.inv <= 0) {
      const dmg = Math.max(1, e.dmg - S.armor); P.hp -= dmg; P.inv = B.player.hitInvulnerable; G.shake = Math.max(G.shake, 9); G.hurt = 1; sfx('hurt');
      G.texts.push({ x: P.x, y: P.y - 30, v: '-' + dmg, life: .7, col: '#ff6b5a' });
      if (P.hp <= 0) {
        if (shopLv('revive') && !G.revived) {
          G.revived = true; P.hp = S.max * B.revive.hpPercent; P.inv = B.revive.invulnerable; sfx('revive'); banner(TEXT.revive);
          for (const o of [...G.enemies]) if (Math.hypot(o.x - P.x, o.y - P.y) < B.revive.clearRadius && o.type !== 'boss') killEnemy(o);
          break;
        } else { P.hp = 0; gameOver(); return; }
      }
    }
  }
  // Gegner schieben sich leicht auseinander
  const E = G.enemies;
  for (let i = 0; i < E.length; i++) { const a = E[i];
    for (let j = i + 1; j < Math.min(E.length, i + 12); j++) { const b = E[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), m = a.r + b.r - 4;
      if (d > 0 && d < m) { const p = (m - d) / 2 / d; a.x -= dx * p; a.y -= dy * p; b.x += dx * p; b.y += dy * p; } } }

  // Geschosse
  for (const b of G.bullets) {
    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    for (const e of [...G.enemies]) { if (b.hit.has(e)) continue;
      if (Math.hypot(e.x - b.x, e.y - b.y) < e.r + b.r + 1) { b.hit.add(e); const s = Math.hypot(b.vx, b.vy); hitEnemy(e, b.dmg, b.vx / s * b.kb, b.vy / s * b.kb);
        if (b.pierce-- <= 0) { b.life = 0; break; } } }
  }
  G.bullets = G.bullets.filter(b => b.life > 0);
  for (const b of G.booms) {
    if (b.out) { b.x += b.vx * dt; b.y += b.vy * dt; b.dist += Math.hypot(b.vx, b.vy) * dt; if (b.dist >= b.max) b.out = false; }
    else { const dx = P.x - b.x, dy = P.y - b.y, d = Math.hypot(dx, dy); if (d < 22) { b.dead = true; continue; } const rs = WEAPONS.boomerang.returnSpeed; b.x += dx / d * rs * dt; b.y += dy / d * rs * dt; }
    b.rot += dt * 20;
    for (const e of [...G.enemies]) if (Math.hypot(e.x - b.x, e.y - b.y) < e.r + 14) { const l = b.hits.get(e) || -9; if (G.t - l > .35) { b.hits.set(e, G.t); hitEnemy(e, b.dmg, (e.x - b.x) * .15, (e.y - b.y) * .15, '#f2c27a'); } }
  }
  G.booms = G.booms.filter(b => !b.dead);
  for (const n of G.nades) { n.k += dt / n.dur; if (n.k >= 1) { n.dead = true; explode(n.tx, n.ty, n.R, n.dmg); } }
  G.nades = G.nades.filter(n => !n.dead);

  // Einsammeln
  const pull = (g, fn) => { const dx = P.x - g.x, dy = P.y - g.y, d = Math.hypot(dx, dy) || 1;
    if (d < S.magnet || g.pull) { g.pull = true; const s = Math.max(280, 620 - d) * dt; g.x += dx / d * s; g.y += dy / d * s; }
    if (d < P.r + 9) { g.done = true; fn(g); } };
  for (const c of G.coins) pull(c, c => { G.runGold += c.v; sfx('coin'); });
  G.coins = G.coins.filter(c => !c.done);
  for (const d of G.drops) if (Math.hypot(P.x - d.x, P.y - d.y) < P.r + 18) { d.done = true; useDrop(d); }
  G.drops = G.drops.filter(d => !d.done);
  for (const g of G.gems) { if (G.state !== 'play') break; pull(g, g => collect(g.v)); }
  G.gems = G.gems.filter(g => !g.done); if (G.gems.length > 420) G.gems.splice(0, G.gems.length - 420);

  // Effekte altern lassen
  for (const p of G.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .9; p.vy *= .9; p.life -= dt; }
  G.parts = G.parts.filter(p => p.life > 0); if (G.parts.length > 500) G.parts.splice(0, G.parts.length - 500);
  for (const f of G.fires) { f.x += f.vx * dt; f.y += f.vy * dt; f.vx *= .92; f.vy *= .92; f.life -= dt; }
  G.fires = G.fires.filter(f => f.life > 0);
  for (const x of G.texts) { x.y -= 40 * dt; x.life -= dt; } G.texts = G.texts.filter(x => x.life > 0);
  for (const b of G.bolts) b.life -= dt; G.bolts = G.bolts.filter(b => b.life > 0);
  for (const l of G.lights) l.life -= dt; G.lights = G.lights.filter(l => l.life > 0);
  for (const d of G.decals) d.a = Math.max(0, d.a - dt * .02);
  G.shake = Math.max(0, G.shake - dt * 40); G.hurt = Math.max(0, G.hurt - dt * 2.5);
}
