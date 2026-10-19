// Steuerung: Daumen irgendwo hinlegen und ziehen (oder Pfeiltasten/WASD am PC)
import { cv } from './screen.js';
import { G } from '../game/state.js';
import { audioInit } from './audio.js';

export const joy = { on: false, bx: 0, by: 0, x: 0, y: 0, id: null, max: 55 };
const keys = {};
export function setupInput(onPause) {
  cv.addEventListener('pointerdown', e => { audioInit(); if (G.state !== 'play') return; joy.on = true; joy.id = e.pointerId; joy.bx = joy.x = e.clientX; joy.by = joy.y = e.clientY; });
  addEventListener('pointermove', e => { if (joy.on && e.pointerId === joy.id) { joy.x = e.clientX; joy.y = e.clientY; } });
  const end = e => { if (e.pointerId === joy.id) { joy.on = false; joy.id = null; } };
  addEventListener('pointerup', end); addEventListener('pointercancel', end);
  addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; if (e.key === 'Escape' || e.key === 'p') onPause(); });
  addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  document.addEventListener('gesturestart', e => e.preventDefault());
  document.addEventListener('visibilitychange', () => { if (document.hidden && G.state === 'play') onPause(); });
}
export function readInput() {
  let dx = 0, dy = 0;
  if (joy.on) {
    dx = joy.x - joy.bx; dy = joy.y - joy.by; const d = Math.hypot(dx, dy), m = joy.max;
    if (d > m) { joy.bx = joy.x - dx / d * m; joy.by = joy.y - dy / d * m; dx = dx / d * m; dy = dy / d * m; }
    dx /= m; dy /= m; if (Math.hypot(dx, dy) < .12) { dx = 0; dy = 0; }
  }
  if (keys.arrowleft || keys.a) dx = -1; if (keys.arrowright || keys.d) dx = 1;
  if (keys.arrowup || keys.w) dy = -1; if (keys.arrowdown || keys.s) dy = 1;
  const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
  return [dx, dy];
}
