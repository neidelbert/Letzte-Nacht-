// Alle Menüs: Start, Charaktere, Werkstatt, Stufenaufstieg, Pause, Game Over
import { G } from '../game/state.js';
import { BALANCE } from '../config/balance.js';
import { CHARACTERS } from '../config/characters.js';
import { WEAPONS } from '../config/weapons.js';
import { PASSIVES } from '../config/passives.js';
import { SHOP, SHOP_PRICE_GROWTH } from '../config/shop.js';
import { TEXT } from '../config/texts.js';
import { save, persist, shopLv } from '../engine/save.js';
import { sfx, audioInit, setMuted } from '../engine/audio.js';
import { joy } from '../engine/input.js';
import { $, fmtTime, applyMod } from '../engine/util.js';
import { icon, portrait } from '../graphics/icons.js';
import { coinImg, renderSlots } from './hud.js';
import { rollOptions } from '../game/progress.js';
import { newGame } from '../game/run.js';

export function showVeil(html) { $('box').innerHTML = html; $('veil').classList.remove('hidden'); $('veil').scrollTop = 0; }
export function hideVeil() { $('veil').classList.add('hidden'); }
const goldLine = v => `<div class="goldline"><img src="${icon('coin')}" alt="">${v}</div>`;
const shopPrice = s => Math.round(s.price * Math.pow(SHOP_PRICE_GROWTH, shopLv(s.id)));
const soundLabel = () => save.muted ? TEXT.soundOff : TEXT.soundOn;
const toMenu = () => { G.state = 'menu'; $('hud').classList.add('hidden'); $('pause').classList.add('hidden'); };

export function menu() {
  toMenu();
  const c = CHARACTERS.find(c => c.id === save.sel) || CHARACTERS[0];
  showVeil(`<h1>${TEXT.title}</h1>
    <img class="portrait" src="${portrait(c.id)}" alt="${c.name}">
    <p class="small">${c.name}, ${c.title}</p>
    ${goldLine(save.gold)}
    <button class="go" id="play">${TEXT.play}</button>
    <div class="row2"><button class="sec" id="chars">${TEXT.characters}</button><button class="sec" id="shop">${TEXT.shop}</button></div>
    ${save.best ? `<p class="small">${TEXT.record}: ${fmtTime(save.best.t)} ${TEXT.survived}, ${save.best.kills} ${TEXT.kills}</p>` : ''}
    <button class="link" id="mute">${soundLabel()}</button>`);
  $('play').onclick = () => { audioInit(); sfx('click'); newGame(); };
  $('chars').onclick = () => { audioInit(); sfx('click'); charsUI(); };
  $('shop').onclick = () => { audioInit(); sfx('click'); shopUI(); };
  $('mute').onclick = () => { audioInit(); setMuted(!save.muted); menu(); };
}
export function charsUI() {
  toMenu();
  showVeil(`<h2>${TEXT.characters}</h2>${goldLine(save.gold)}<div class="list">${CHARACTERS.map(c => {
    const own = save.chars[c.id], sel = save.sel === c.id;
    const btn = sel ? `<button class="buy ok" disabled>${TEXT.chosen}</button>` : own ? `<button class="buy ok" data-sel="${c.id}">${TEXT.choose}</button>` : `<button class="buy" data-buy="${c.id}" ${save.gold < c.price ? 'disabled' : ''}>${coinImg()}${c.price}</button>`;
    return `<div class="item ${sel ? 'sel' : ''}"><img src="${portrait(c.id)}" alt=""><span class="tx"><b>${c.name}</b><span class="d">${c.title}. ${TEXT.startsWith} ${WEAPONS[c.weapon].name}. ${c.bonusText}.</span></span>${btn}</div>`;
  }).join('')}</div><button class="go" id="back">${TEXT.back}</button>`);
  document.querySelectorAll('[data-sel]').forEach(b => b.onclick = () => { sfx('click'); save.sel = b.dataset.sel; persist(); charsUI(); });
  document.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => { const c = CHARACTERS.find(x => x.id === b.dataset.buy); if (save.gold < c.price) return; save.gold -= c.price; save.chars[c.id] = true; save.sel = c.id; persist(); sfx('pickup'); charsUI(); });
  $('back').onclick = () => { sfx('click'); menu(); };
}
export function shopUI() {
  toMenu();
  showVeil(`<h2>${TEXT.shop}</h2><p class="small">${TEXT.shopSub}</p>${goldLine(save.gold)}<div class="list">${SHOP.map(s => {
    const l = shopLv(s.id), price = shopPrice(s);
    const btn = l >= s.max ? `<button class="buy ok" disabled>${TEXT.done}</button>` : `<button class="buy" data-up="${s.id}" ${save.gold < price ? 'disabled' : ''}>${coinImg()}${price}</button>`;
    return `<div class="item"><img src="${icon(s.icon)}" alt=""><span class="tx"><b>${s.name}</b><span class="d">${s.desc}</span><span class="pips">${Array.from({ length: s.max }, (_, i) => `<i class="${i < l ? 'f' : ''}"></i>`).join('')}</span></span>${btn}</div>`;
  }).join('')}</div><button class="go" id="back">${TEXT.back}</button>`);
  document.querySelectorAll('[data-up]').forEach(b => b.onclick = () => { const s = SHOP.find(x => x.id === b.dataset.up), p = shopPrice(s); if (save.gold < p || shopLv(s.id) >= s.max) return; save.gold -= p; save.shop[s.id] = shopLv(s.id) + 1; persist(); sfx('pickup'); shopUI(); });
  $('back').onclick = () => { sfx('click'); menu(); };
}
export function showUps() {
  G.state = 'up'; joy.on = false; sfx('level');
  for (let k = 0; k < 24; k++) { const a = k / 24 * 6.28; G.parts.push({ x: G.P.x, y: G.P.y, vx: Math.cos(a) * 260, vy: Math.sin(a) * 260, life: .4, max: .4, col: '#a98bff', r: 3, glow: true }); }
  const opts = rollOptions();
  const card = (i, ic, name, desc, tag) => `<button class="item" data-i="${i}"><img src="${icon(ic)}" alt=""><span class="tx"><b>${name}</b><span class="d">${desc}</span></span>${tag ? `<span class="lv">${tag}</span>` : ''}</button>`;
  showVeil(`<h2>${TEXT.level} ${G.lvl}!</h2><div class="list">${opts.map((o, i) => {
    if (o.k === 'gold') return card(i, 'greed', TEXT.goldBag, TEXT.goldBagDesc);
    if (o.k === 'w') { const C = WEAPONS[o.id], own = G.W[o.id]; return card(i, o.id, C.name, own ? C.upgrade : C.desc, own ? TEXT.level + ' ' + (own.lvl + 1) : TEXT.newWeapon); }
    const p = PASSIVES[o.id], l = G.PL[o.id] || 0; return card(i, o.id, p.name, p.desc, l ? TEXT.level + ' ' + (l + 1) : TEXT.isNew);
  }).join('')}</div>`);
  document.querySelectorAll('.item').forEach(b => b.onclick = () => {
    const o = opts[+b.dataset.i]; sfx('click');
    if (o.k === 'gold') G.runGold += BALANCE.gold.levelUpBag;
    else if (o.k === 'w') { if (G.W[o.id]) G.W[o.id].lvl++; else G.W[o.id] = { lvl: 1, cd: .2 }; }
    else { const p = PASSIVES[o.id]; G.PL[o.id] = (G.PL[o.id] || 0) + 1; applyMod(G.S, p.effect); if (p.healFull) G.P.hp = G.S.max; }
    renderSlots(); G.pendingUps--;
    if (G.pendingUps > 0) showUps(); else { hideVeil(); G.state = 'play'; }
  });
}
export function togglePause() {
  if (G.state === 'play') {
    G.state = 'pause'; joy.on = false;
    showVeil(`<h2>${TEXT.pause}</h2><p class="stat">${fmtTime(G.t)} · ${G.kills} ${TEXT.kills}</p>${goldLine('+' + Math.round(G.runGold * G.S.goldMul))}
      <button class="go" id="go">${TEXT.resume}</button><div class="row2"><button class="sec" id="mute">${soundLabel()}</button><button class="sec" id="quit">${TEXT.giveUp}</button></div>`);
    $('go').onclick = togglePause;
    $('mute').onclick = () => { setMuted(!save.muted); $('mute').textContent = soundLabel(); };
    $('quit').onclick = () => { hideVeil(); gameOver(); };
  } else if (G.state === 'pause') { G.state = 'play'; hideVeil(); }
}
export function gameOver() {
  if (G.state === 'over') return;
  G.state = 'over'; joy.on = false; $('pause').classList.add('hidden');
  const Gd = BALANCE.gold, earned = Math.round((G.runGold + Math.floor(G.t / Gd.bonusEverySeconds) + Math.floor(G.kills / Gd.bonusEveryKills)) * G.S.goldMul);
  save.gold += earned;
  const isBest = !save.best || G.t > save.best.t; if (isBest) save.best = { t: G.t, kills: G.kills, lvl: G.lvl };
  persist();
  setTimeout(() => {
    showVeil(`<h1>${TEXT.dead}</h1><p class="stat">${fmtTime(G.t)} ${TEXT.survived}</p><p>${G.kills} ${TEXT.kills} · ${TEXT.level} ${G.lvl}</p>
      ${goldLine('+' + earned + ' Gold')}<p>${isBest ? TEXT.newRecord : `${TEXT.record}: ${fmtTime(save.best.t)} · ${save.best.kills} ${TEXT.kills}`}</p>
      <button class="go" id="go">${TEXT.again}</button><div class="row2"><button class="sec" id="shop">${TEXT.shop}</button><button class="sec" id="home">${TEXT.menu}</button></div>`);
    $('go').onclick = () => { sfx('click'); newGame(); };
    $('shop').onclick = () => { sfx('click'); shopUI(); };
    $('home').onclick = () => { sfx('click'); menu(); };
  }, 900);
}
