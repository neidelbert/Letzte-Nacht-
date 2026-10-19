// Lädt die Bilder aus art.js (erzeugt von tools/art.py aus dem Ordner grafik/).
// Fehlt ein Bild, zeichnet das Spiel die alte Figur per Code (siehe sprites.js).
import { ART } from './art.js';

export const PIC = {}; // geladene Bilder, z. B. PIC['zombies/walker']

export function loadArt(done) {
  const keys = Object.keys(ART); let left = keys.length, fired = false;
  const finish = () => { if (!fired) { fired = true; done(); } };
  if (!left) return finish();
  for (const k of keys) {
    const im = new Image();
    im.onload = () => { PIC[k] = im; if (--left === 0) finish(); };
    im.onerror = () => { if (--left === 0) finish(); };
    im.src = ART[k];
  }
  setTimeout(finish, 5000); // Sicherheitsnetz: nach 5 s trotzdem starten
}
