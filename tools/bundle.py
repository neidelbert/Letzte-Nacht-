#!/usr/bin/env python3
"""Packt das ganze Projekt in EINE Datei: dist/letzte-nacht.html
Nötig für Claude-Artifacts (dort geht nur eine einzelne HTML-Datei).
Aufruf:  python3 tools/bundle.py
"""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
# Reihenfolge: zuerst Einstellungen, dann Technik, dann Spiel, zuletzt main.js
ORDER = [
  'config/balance.js', 'config/enemies.js', 'config/weapons.js', 'config/passives.js', 'config/characters.js',
  'config/shop.js', 'config/look.js', 'config/sound.js', 'config/texts.js',
  'engine/util.js', 'engine/screen.js', 'engine/save.js', 'engine/audio.js', 'game/state.js',
  'graphics/sprites.js', 'graphics/icons.js', 'graphics/ground.js', 'graphics/lighting.js',
  'ui/hud.js', 'game/combat.js', 'game/progress.js', 'game/weapons.js', 'game/run.js', 'game/update.js', 'game/draw.js',
  'ui/menus.js', 'engine/input.js', 'main.js',
]
found = {str(p.relative_to(ROOT / 'js')) for p in (ROOT / 'js').rglob('*.js')}
missing = found - set(ORDER)
if missing: raise SystemExit('Neue Datei(en) bitte in ORDER eintragen: ' + ', '.join(sorted(missing)))
parts = []
for rel in ORDER:
  code = (ROOT / 'js' / rel).read_text(encoding='utf-8')
  code = re.sub(r'^import [^;]+;\s*$', '', code, flags=re.M)
  code = re.sub(r'^export (const|let|function|class) ', r'\1 ', code, flags=re.M)
  parts.append(f'// ===== {rel} =====\n{code}')
html = (ROOT / 'index.html').read_text(encoding='utf-8')
css = (ROOT / 'css' / 'style.css').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="css/style.css">', f'<style>\n{css}</style>')
js = "(()=>{\n'use strict';\n" + '\n'.join(parts) + '\n})();'
html = html.replace('<script type="module" src="js/main.js"></script>', f'<script>\n{js}\n</script>')
out = ROOT / 'dist' / 'letzte-nacht.html'; out.parent.mkdir(exist_ok=True); out.write_text(html, encoding='utf-8')
print('Fertig:', out, f'({len(html)//1024} KB)')
