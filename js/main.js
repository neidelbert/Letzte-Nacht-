// Startpunkt des Spiels: alles verbinden und die Hauptschleife starten
import { G } from './game/state.js';
import { resize } from './engine/screen.js';
import { setupInput } from './engine/input.js';
import { music } from './engine/audio.js';
import { $ } from './engine/util.js';
import { buildSprites } from './graphics/sprites.js';
import { update } from './game/update.js';
import { draw, drawMenuBG } from './game/draw.js';
import { tickBanner, updateHud } from './ui/hud.js';
import { menu, togglePause } from './ui/menus.js';

export const VERSION = '2.1.0';
addEventListener('resize', resize); resize();
setupInput(togglePause);
$('pause').onclick = togglePause;

let last = performance.now(), hudTimer = 0;
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (G.state === 'play') { update(dt); music(G.t); }
  if (G.P && G.state !== 'menu') draw(); else drawMenuBG(dt);
  tickBanner(dt);
  hudTimer -= dt;
  if (G.P && hudTimer <= 0 && G.state !== 'menu') { hudTimer = .1; updateHud(); }
}
buildSprites();
menu();
requestAnimationFrame(loop);

// Nur für automatische Tests (tests/smoke-test.js)
window.__LN = { G, god() { G.S.regen = 5000; G.S.max = 5000; G.P.hp = 5000; } };
