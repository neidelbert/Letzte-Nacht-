#!/usr/bin/env python3
"""Macht aus den Original-Bildern in grafik/ kleine WebP-Bilder und schreibt sie
als Daten in js/graphics/art.js (so klappt es auf GitHub Pages UND als eine Datei).
Aufruf:  python3 tools/art.py   (danach python3 tools/bundle.py)
Braucht Pillow und numpy.

Neues Bild? In grafik/<ordner>/ ablegen und unten in HEIGHT eintragen.
"""
import base64, io, pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'grafik'
OUT = ROOT / 'js' / 'graphics' / 'art.js'

# Höhe in Pixeln, die im Spiel gespeichert wird (doppelt so groß wie angezeigt → scharf auf dem iPhone)
HEIGHT = {
  'charaktere': 256,
  'zombies': 168, 'zombies/brute': 224, 'zombies/boss': 336, 'zombies/dog': 150,
  'items': 96,
}
QUALITY = 84
GROUND = ('boden/friedhof-1024.png', 768, 72)  # Datei, Größe, Qualität


def webp(im, q):
  b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=6)
  return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()


def sprite(path, h):
  im = Image.open(path).convert('RGBA')
  im = im.crop(im.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox())
  w = max(1, round(im.width * h / im.height))
  return im.resize((w, h), Image.LANCZOS)


def gold(im):
  """Färbt den blauen Kristall golden (für große Erfahrungs-Kristalle)."""
  hsv = np.asarray(im.convert('RGB').convert('HSV')).copy()
  hsv[..., 0] = (hsv[..., 0].astype(int) - 105) % 256  # Farbton von Blau nach Gold drehen
  out = Image.fromarray(hsv, 'HSV').convert('RGBA'); out.putalpha(im.getchannel('A'))
  return out


art = {}
for p in sorted(SRC.glob('*/*.png')):
  key = f'{p.parent.name}/{p.stem}'
  if p.parent.name == 'boden': continue
  im = sprite(p, HEIGHT.get(key, HEIGHT[p.parent.name]))
  art[key] = webp(im, QUALITY)
  if key == 'items/xp-cyan': art['items/xp-gold'] = webp(gold(im), QUALITY)
name, size, q = GROUND
art['boden/friedhof'] = webp(Image.open(SRC / name).convert('RGB').resize((size, size), Image.LANCZOS), q)

lines = ['// AUTOMATISCH ERZEUGT von tools/art.py aus dem Ordner grafik/ – nicht von Hand ändern.',
         'export const ART = {']
lines += [f"  '{k}': '{v}'," for k, v in art.items()]
lines.append('};')
OUT.write_text('\n'.join(lines) + '\n', encoding='utf-8')
print('Fertig:', OUT, f'({OUT.stat().st_size // 1024} KB, {len(art)} Bilder)')
