// Bildschirm, Zeichenfläche und Dunkelheits-Ebene
export const cv = document.getElementById('cv');
export const ctx = cv.getContext('2d');
export const dark = document.createElement('canvas');
export const dctx = dark.getContext('2d');
export const view = { w: 0, h: 0, dpr: 1 };
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export function resize() {
  view.dpr = Math.min(2, window.devicePixelRatio || 1); view.w = innerWidth; view.h = innerHeight;
  cv.width = Math.round(view.w * view.dpr); cv.height = Math.round(view.h * view.dpr);
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  dark.width = Math.ceil(view.w / 2); dark.height = Math.ceil(view.h / 2);
}
