// Erfahrung, Stufenaufstieg, Fundstücke
import { G } from './state.js';
import { BALANCE } from '../config/balance.js';
import { WEAPONS } from '../config/weapons.js';
import { PASSIVES } from '../config/passives.js';
import { TEXT } from '../config/texts.js';
import { view } from '../engine/screen.js';
import { sfx, AC } from '../engine/audio.js';
import { hitEnemy } from './combat.js';
import { banner } from '../ui/hud.js';
import { showUps } from '../ui/menus.js';

export const xpNeeded = lvl => Math.round(BALANCE.xp.first + lvl * BALANCE.xp.perLevel + Math.pow(lvl, BALANCE.xp.curve));
export function collect(v) {
  G.xp += v; AC.gemCombo++; G.gemComboT = .6; sfx('gem');
  while (G.xp >= G.next) { G.xp -= G.next; G.lvl++; G.next = xpNeeded(G.lvl); G.pendingUps++; }
  if (G.pendingUps > 0 && G.state === 'play') showUps();
}
export function useDrop(d) {
  const P = G.P, S = G.S; sfx('pickup');
  if (d.k === 'heal') { const h = Math.round(S.max * BALANCE.drops.healPercent); P.hp = Math.min(S.max, P.hp + h); G.texts.push({ x: P.x, y: P.y - 30, v: '+' + h, life: .9, col: '#7be08a' }); }
  if (d.k === 'magnet') { G.gems.forEach(g => g.pull = true); G.coins.forEach(g => g.pull = true); banner(TEXT.magnet); }
  if (d.k === 'bomb') {
    G.shake = 16; G.lights.push({ x: P.x, y: P.y, r: Math.max(view.w, view.h), life: .4, max: .4, warm: true }); sfx('boom');
    for (const e of [...G.enemies]) if (Math.abs(e.x - P.x) < view.w / 2 + 30 && Math.abs(e.y - P.y) < view.h / 2 + 30) hitEnemy(e, e.type === 'boss' ? 300 : 99999, 0, 0, '#ffd27a');
    banner(TEXT.bomb);
  }
}
// Drei zufällige Angebote für den Stufenaufstieg
export function rollOptions() {
  const Lm = BALANCE.limits, pool = [];
  for (const id in G.W) if (G.W[id].lvl < Lm.maxWeaponLevel) pool.push({ k: 'w', id, wt: 3 });
  if (Object.keys(G.W).length < Lm.maxWeapons) for (const id in WEAPONS) if (!G.W[id]) pool.push({ k: 'w', id, wt: 2 });
  for (const id in PASSIVES) if ((G.PL[id] || 0) < Lm.maxPassiveLevel) pool.push({ k: 'p', id, wt: 2 });
  const out = [];
  while (out.length < 3 && pool.length) {
    let r = Math.random() * pool.reduce((s, o) => s + o.wt, 0), i = 0;
    while (i < pool.length - 1 && r > pool[i].wt) { r -= pool[i].wt; i++; }
    out.push(pool.splice(i, 1)[0]);
  }
  if (!out.length) out.push({ k: 'gold' });
  return out;
}
