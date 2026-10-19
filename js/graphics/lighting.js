// Nacht und Licht: dunkle Ebene, aus der Lichtkreise "herausgeschnitten" werden
import { ctx, dark, dctx, view } from '../engine/screen.js';
import { LOOK } from '../config/look.js';

export function lighting(cx, cy, lights, darkness) {
  dctx.setTransform(1, 0, 0, 1, 0, 0); dctx.globalCompositeOperation = 'source-over';
  dctx.clearRect(0, 0, dark.width, dark.height); dctx.fillStyle = `rgba(${LOOK.night},${darkness})`; dctx.fillRect(0, 0, dark.width, dark.height);
  dctx.setTransform(.5, 0, 0, .5, 0, 0); dctx.globalCompositeOperation = 'destination-out';
  for (const L of lights) {
    const x = L.x + cx, y = L.y + cy, a = L.a, g = dctx.createRadialGradient(x, y, 0, x, y, L.r);
    g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(.55, `rgba(0,0,0,${a * .6})`); g.addColorStop(1, 'rgba(0,0,0,0)');
    dctx.fillStyle = g; dctx.fillRect(x - L.r, y - L.r, L.r * 2, L.r * 2);
  }
  ctx.drawImage(dark, 0, 0, view.w, view.h);
  ctx.globalCompositeOperation = 'lighter';
  for (const L of lights) if (L.warm) {
    const x = L.x + cx, y = L.y + cy, g = ctx.createRadialGradient(x, y, 0, x, y, L.r * .7);
    g.addColorStop(0, `rgba(255,150,60,${.22 * L.a})`); g.addColorStop(1, 'rgba(255,120,40,0)');
    ctx.fillStyle = g; ctx.fillRect(x - L.r, y - L.r, L.r * 2, L.r * 2);
  }
  ctx.globalCompositeOperation = 'source-over';
}
