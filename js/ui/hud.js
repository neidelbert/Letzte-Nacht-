// Anzeige oben im Spiel: Zeit, Kills, Stufe, Waffen, Gold, Banner
import { G } from '../game/state.js';
import { WEAPONS } from '../config/weapons.js';
import { TEXT } from '../config/texts.js';
import { $, fmtTime } from '../engine/util.js';
import { icon } from '../graphics/icons.js';

let bannerTime = 0;
export const coinImg = () => `<img class="ci" src="${icon('coin')}" alt="Gold">`;
export function banner(txt) { const b = $('banner'); b.textContent = txt; b.classList.add('on'); bannerTime = 2.2; }
export function tickBanner(dt) { if (bannerTime > 0) { bannerTime -= dt; if (bannerTime <= 0) $('banner').classList.remove('on'); } }
export function renderSlots() {
  $('slots').innerHTML = Object.keys(G.W).map(id => `<div><img src="${icon(id)}" alt="${WEAPONS[id].name}"><b>${G.W[id].lvl}</b></div>`).join('');
}
export function updateHud() {
  $('time').textContent = fmtTime(G.t);
  $('kills').textContent = G.kills + ' ' + TEXT.kills;
  $('lvl').textContent = TEXT.level + ' ' + G.lvl;
  $('xpfill').style.width = (100 * G.xp / G.next) + '%';
  $('rgold').innerHTML = coinImg() + Math.round(G.runGold * G.S.goldMul);
}
