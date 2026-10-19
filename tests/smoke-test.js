// Automatischer Test ohne Browser: spielt eine Runde mit einem simulierten Spieler.
// Aufruf:  python3 tools/bundle.py && node tests/smoke-test.js
// Mit GOD=1 ist der Held unverwundbar (Test für 10 Minuten Spielzeit).
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'dist', 'letzte-nacht.html'), 'utf8');
const code = html.match(/<script>\n([\s\S]*)\n<\/script>/)[1];

let boxHTML = ''; const cache = { h: null, l: [] };
function el(id) { return { id, classList: { s: new Set(), add(c) { this.s.add(c); }, remove(c) { this.s.delete(c); }, contains(c) { return this.s.has(c); } },
  style: {}, _h: '', set innerHTML(v) { this._h = v; if (id === 'box') boxHTML = v; }, get innerHTML() { return this._h; },
  textContent: '', dataset: {}, onclick: null, scrollTop: 0, addEventListener() {} }; }
const els = {};
const ctx2d = new Proxy({}, { get(t, k) { if (k === 'createRadialGradient' || k === 'createLinearGradient') return () => ({ addColorStop() {} }); return k in t ? t[k] : () => {}; }, set(t, k, v) { t[k] = v; return true; } });
global.document = {
  getElementById: id => els[id] || (els[id] = id === 'cv' ? Object.assign(el(id), { getContext: () => ctx2d }) : el(id)),
  createElement: () => ({ width: 0, height: 0, getContext: () => ctx2d, toDataURL: () => 'data:' }),
  querySelectorAll: sel => { if (sel !== '.item') return []; if (cache.h === boxHTML) return cache.l;
    const out = []; for (const m of boxHTML.matchAll(/data-i="(\d+)"/g)) { const e = el('i'); e.dataset.i = m[1]; out.push(e); } cache.h = boxHTML; cache.l = out; return out; },
  addEventListener() {}, hidden: false,
};
const H = {}; global.addEventListener = (n, f) => (H[n] = H[n] || []).push(f);
const key = (t, k) => (H[t] || []).forEach(f => f({ key: k, preventDefault() {} }));
Object.assign(global, { innerWidth: 390, innerHeight: 844, devicePixelRatio: 3, matchMedia: () => ({ matches: false }), window: global,
  localStorage: { d: {}, getItem(k) { return this.d[k] || null; }, setItem(k, v) { this.d[k] = v; } }, setTimeout: f => f() });
let raf = null, now = 0; global.requestAnimationFrame = f => { raf = f; }; global.performance = { now: () => now };

eval(code);
document.getElementById('play').onclick();
if (process.env.GOD) window.__LN.god();
const dirs = ['d', 's', 'a', 'w']; let cur = null, ups = 0;
for (let i = 0; i < 60 * 600; i++) {
  now += 16.7;
  if (i % 90 === 0) { if (cur) key('keyup', cur); cur = dirs[(i / 90) % 4]; key('keydown', cur); }
  raf(now);
  if (!document.getElementById('veil').classList.contains('hidden')) {
    const items = document.querySelectorAll('.item');
    if (items.length) { ups++; items[Math.floor(Math.random() * items.length)].onclick(); }
    else if (/<h1>/.test(boxHTML) && window.__LN.G.state === 'over') break;
  }
}
const G = window.__LN.G;
console.log(`OK – Zustand: ${G.state}, Zeit: ${G.t.toFixed(0)} s, Kills: ${G.kills}, Stufe: ${G.lvl}, Upgrades gewählt: ${ups}, Waffen: ${Object.keys(G.W).map(k => k + G.W[k].lvl).join(' ')}`);
