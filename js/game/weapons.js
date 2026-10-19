// Wie jede Waffe funktioniert. Die ZAHLEN stehen in config/weapons.js.
// Neue Waffe? → hier einen Block "if (id === 'neu')" ergänzen + Eintrag in config/weapons.js + Symbol in graphics/icons.js
import { G } from './state.js';
import { WEAPONS } from '../config/weapons.js';
import { view } from '../engine/screen.js';
import { sfx } from '../engine/audio.js';
import { rnd, ri, angDiff, lv } from '../engine/util.js';
import { nearest, hitEnemy } from './combat.js';

export function updWeapons(dt) {
  const P = G.P, S = G.S;
  for (const id in G.W) {
    const w = G.W[id], L = w.lvl, C = WEAPONS[id]; w.cd -= dt;

    if (id === 'revolver' && w.cd <= 0) {
      const tg = nearest(P.x, P.y, Math.max(view.w, view.h) * C.range); if (!tg) { w.cd = .1; continue; }
      const n = lv(C.bullets, L), a = Math.atan2(tg.y - P.y, tg.x - P.x); P.face = Math.cos(a) < 0 ? -1 : 1;
      for (let i = 0; i < n; i++) { const aa = a + (i - (n - 1) / 2) * C.spread; G.bullets.push({ x: P.x + Math.cos(aa) * 16, y: P.y - 4 + Math.sin(aa) * 16, vx: Math.cos(aa) * C.speed, vy: Math.sin(aa) * C.speed, life: C.lifetime, pierce: lv(C.pierce, L), dmg: lv(C.damage, L), kb: C.knockback, hit: new Set(), col: '#ffe2a0', r: 3.6 }); }
      G.lights.push({ x: P.x + Math.cos(a) * 20, y: P.y + Math.sin(a) * 20, r: 90, life: .06, max: .06, warm: true });
      w.cd = lv(C.cooldown, L) * S.cdMul; sfx('shot');
    }
    if (id === 'shotgun' && w.cd <= 0) {
      const tg = nearest(P.x, P.y, C.range); if (!tg) { w.cd = .1; continue; }
      const n = lv(C.pellets, L), a = Math.atan2(tg.y - P.y, tg.x - P.x); P.face = Math.cos(a) < 0 ? -1 : 1;
      for (let i = 0; i < n; i++) { const aa = a + rnd(-C.spread, C.spread), sp = rnd(C.speedMin, C.speedMax); G.bullets.push({ x: P.x, y: P.y - 4, vx: Math.cos(aa) * sp, vy: Math.sin(aa) * sp, life: rnd(C.lifeMin, C.lifeMax), pierce: 0, dmg: lv(C.damage, L), kb: C.knockback, hit: new Set(), col: '#ffd27a', r: 2.8 }); }
      G.lights.push({ x: P.x + Math.cos(a) * 24, y: P.y + Math.sin(a) * 24, r: 140, life: .08, max: .08, warm: true });
      G.shake = Math.max(G.shake, 3); w.cd = lv(C.cooldown, L) * S.cdMul; sfx('shotgun');
    }
    if (id === 'flamer') {
      const len = lv(C.length, L) * S.area, tg = nearest(P.x, P.y, len + 30);
      if (!tg) { w.on = false; continue; }
      const a = Math.atan2(tg.y - P.y, tg.x - P.x); w.aim = w.on ? w.aim + angDiff(a, w.aim) * Math.min(1, dt * 10) : a; w.on = true; P.face = Math.cos(w.aim) < 0 ? -1 : 1;
      for (let k = 0; k < 3; k++) { if (G.fires.length > 220) break; const aa = w.aim + rnd(-.28, .28), sp = rnd(len * 2.1, len * 2.8); G.fires.push({ x: P.x + Math.cos(w.aim) * 16, y: P.y - 4 + Math.sin(w.aim) * 16, vx: Math.cos(aa) * sp, vy: Math.sin(aa) * sp, life: .42, max: .42, r: rnd(5, 9) }); }
      if (w.cd <= 0) {
        w.cd = C.tick;
        for (const e of [...G.enemies]) { const dx = e.x - P.x, dy = e.y - P.y, d = Math.hypot(dx, dy); if (d < len + e.r && Math.abs(angDiff(Math.atan2(dy, dx), w.aim)) < C.cone) hitEnemy(e, lv(C.damage, L), dx / (d || 1) * 2, dy / (d || 1) * 2, '#ffb347'); }
      }
      sfx('flame');
    }
    if (id === 'boomerang' && w.cd <= 0) {
      const tg = nearest(P.x, P.y, C.range); if (!tg) { w.cd = .15; continue; }
      const n = lv(C.count, L), a = Math.atan2(tg.y - P.y, tg.x - P.x);
      for (let i = 0; i < n; i++) { const aa = a + (i - (n - 1) / 2) * .5; G.booms.push({ x: P.x, y: P.y, vx: Math.cos(aa) * C.speed, vy: Math.sin(aa) * C.speed, out: true, dist: 0, max: lv(C.distance, L) * S.area, dmg: lv(C.damage, L), rot: 0, hits: new Map() }); }
      w.cd = lv(C.cooldown, L) * S.cdMul; sfx('throw');
    }
    if (id === 'saws') {
      const n = lv(C.count, L), R = C.radius * S.area; G.sawAng += dt * lv(C.spin, L);
      for (let i = 0; i < n; i++) {
        const a = G.sawAng + i * Math.PI * 2 / n, sx = P.x + Math.cos(a) * R, sy = P.y + Math.sin(a) * R;
        for (const e of [...G.enemies]) if (e.sawCd <= 0 && Math.hypot(e.x - sx, e.y - sy) < e.r + 16) {
          e.sawCd = C.hitDelay; hitEnemy(e, lv(C.damage, L), (e.x - P.x) * .06, (e.y - P.y) * .06, '#e4ecf5');
          G.parts.push({ x: sx, y: sy, vx: rnd(-80, 80), vy: rnd(-80, 80), life: .15, max: .15, col: '#fff2b0', r: 2, glow: true });
        }
      }
    }
    if (id === 'zap' && w.cd <= 0) {
      let cur = nearest(P.x, P.y, C.range); if (!cur) { w.cd = .2; continue; }
      const hit = new Set(), pts = [[P.x, P.y - 10]], jumps = lv(C.jumps, L);
      for (let i = 0; i < jumps && cur; i++) { hit.add(cur); pts.push([cur.x, cur.y]); const c = cur; cur = nearest(c.x, c.y, C.jumpRange, hit); hitEnemy(c, lv(C.damage, L), 0, 0, '#9fd7ff'); }
      G.bolts.push({ pts, life: .18 }); pts.forEach(p => G.lights.push({ x: p[0], y: p[1], r: 90, life: .15, max: .15 }));
      w.cd = lv(C.cooldown, L) * S.cdMul; sfx('zap');
    }
    if (id === 'grenade' && w.cd <= 0) {
      const near = G.enemies.filter(e => Math.hypot(e.x - P.x, e.y - P.y) < C.range); if (!near.length) { w.cd = .2; continue; }
      for (let i = 0; i < lv(C.count, L); i++) { const e = near[ri(0, near.length - 1)]; G.nades.push({ sx: P.x, sy: P.y, tx: e.x + rnd(-20, 20), ty: e.y + rnd(-20, 20), k: 0, dur: C.flightTime, R: lv(C.radius, L) * S.area, dmg: lv(C.damage, L) }); }
      w.cd = lv(C.cooldown, L) * S.cdMul; sfx('throw');
    }
    if (id === 'aura' && w.cd <= 0) {
      const R = lv(C.radius, L) * S.area; w.cd = C.tick;
      for (const e of [...G.enemies]) if (Math.hypot(e.x - P.x, e.y - P.y) < R + e.r) hitEnemy(e, lv(C.damage, L), 0, 0, '#9be08a');
    }
  }
}
