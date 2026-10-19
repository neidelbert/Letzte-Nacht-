# Regeln für Claude – Projekt „Letzte Nacht“

## Wer macht was
- **Lukas** (Game-Director): Ideen, Design, Tests am iPhone. Programmiert nicht selbst.
- **Claude**: komplette Umsetzung. Liefert fertige, getestete Dateien und keine halben Schnipsel.

## Grundregeln
1. Spieltexte auf **Deutsch**, mit typografischen Anführungszeichen („…“).
2. **Keine Emojis in der Spielgrafik.** Alles wird per Canvas-Code gezeichnet (`js/graphics/`).
3. **Zahlen gehören in `js/config/`**, nicht in die Logik. Neue Werte immer dort eintragen und kommentieren.
4. Kein Build-Schritt für GitHub Pages: reine ES-Module, keine npm-Pakete.
5. Läuft auf dem iPhone: Touch zuerst, max. ~240 Gegner, Leistung im Blick behalten.
6. Speicherstand (`letzte-nacht-v2` in localStorage) nicht kaputt machen. Neue Felder bekommen Standardwerte.

## Aufbau
- `js/config/*` – Einstellungen (nur Daten)
- `js/engine/*` – Technik (Bildschirm, Sound, Steuerung, Speichern, Hilfen)
- `js/graphics/*` – Zeichnungen
- `js/game/state.js` – gemeinsamer Zustand `G`, alle Module lesen/schreiben dort
- `js/game/*` – Regeln (combat, weapons, progress, run, update, draw)
- `js/ui/*` – HTML-Menüs und Anzeige
- `js/main.js` – Hauptschleife

## Häufige Aufgaben
- **Neue Waffe:** `config/weapons.js` (Werte) → `game/weapons.js` (Verhalten) → `graphics/icons.js` (Symbol in PAINT + ICON_BG) → evtl. `game/draw.js` (Effekt)
- **Neuer Gegner:** `config/enemies.js` → Zeichnung in `graphics/sprites.js` (+ weiße Treffer-Version in `buildSprites`) → Darstellung in `game/draw.js`
- **Neuer Charakter:** `config/characters.js`; neuer Hut → `HATS` in `graphics/sprites.js`
- **Neue Datei:** in `tools/bundle.py` → `ORDER` eintragen. Top-Level-Namen müssen projektweit eindeutig sein (das Bündel fügt alles zusammen).

## Vor jeder Abgabe
```bash
python3 tools/bundle.py            # dist/letzte-nacht.html neu bauen
node tests/smoke-test.js           # normale Runde
GOD=1 node tests/smoke-test.js     # 10 Minuten Stresstest
```
Dann: `VERSION` in `js/main.js` erhöhen, `CHANGELOG.md` ergänzen, erledigte Punkte in `docs/IDEEN.md` abhaken.
Für Claude.ai: `dist/letzte-nacht.html` als Artifact veröffentlichen.
