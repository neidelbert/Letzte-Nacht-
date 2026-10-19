// Neue Runde starten: Werte aus Charakter + Werkstatt zusammenbauen
import { G } from './state.js';
import { BALANCE } from '../config/balance.js';
import { CHARACTERS } from '../config/characters.js';
import { SHOP } from '../config/shop.js';
import { save, shopLv } from '../engine/save.js';
import { audioInit } from '../engine/audio.js';
import { applyMod, $ } from '../engine/util.js';
import { renderSlots } from '../ui/hud.js';
import { hideVeil } from '../ui/menus.js';

export function newGame() {
  const B = BALANCE;
  G.char = CHARACTERS.find(c => c.id === save.sel) || CHARACTERS[0];
  G.P = { x: 0, y: 0, r: B.player.radius, hp: 0, inv: 0, face: 1, moving: false, step: 0, kick: 0 };
  const S = { dmgMul: 1, cdMul: 1, speed: B.player.speed, max: B.player.hp, magnet: B.player.magnet, regen: 0, armor: 0, area: 1, goldMul: 1 };
  for (const s of SHOP) { const l = shopLv(s.id); if (l && s.effect) applyMod(S, s.effect, l); }
  G.char.bonus.forEach(m => applyMod(S, m));
  G.S = S; G.P.hp = S.max;
  G.W = { [G.char.weapon]: { lvl: 1, cd: .3 } }; G.PL = {};
  for (const k of ['enemies', 'bullets', 'booms', 'nades', 'gems', 'coins', 'drops', 'parts', 'fires', 'texts', 'bolts', 'decals', 'lights', 'corpses']) G[k] = [];
  Object.assign(G, { t: 0, kills: 0, lvl: 1, xp: 0, next: B.xp.first, spawnAcc: 0, sawAng: 0, shake: 0, hurt: 0, nextBoss: B.boss.firstAt, runGold: 0, revived: false, pendingUps: 0 });
  G.state = 'play'; hideVeil(); $('hud').classList.remove('hidden'); $('pause').classList.remove('hidden');
  renderSlots(); audioInit();
}
