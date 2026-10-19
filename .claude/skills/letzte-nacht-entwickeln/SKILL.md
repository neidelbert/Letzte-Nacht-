---
name: letzte-nacht-entwickeln
description: Weiterentwicklung des Zombie-Survival-Browserspiels „Letzte Nacht“ von Lukas (neidelbert). Immer verwenden, wenn es um Letzte Nacht, das Zombie-Spiel, neue Waffen, Gegner, Charaktere, Bosse, Balance, Werkstatt, Grafik, Sound oder Bugs in diesem Spiel geht, auch wenn der Name nicht fällt („mach die Schrotflinte stärker“, „neuer Gegner“, „es ruckelt“).
---

# Letzte Nacht weiterentwickeln

Lukas ist Game-Director und testet am iPhone; er programmiert nicht. Du lieferst fertige, getestete Änderungen.

## Ablauf
1. `CLAUDE.md` im Repo lesen. Dort stehen der Aufbau und die Regeln.
2. Wunsch in eine konkrete Änderung übersetzen. Bei echter Unklarheit **eine** kurze Frage stellen, locker formuliert.
3. Werte immer in `js/config/` ablegen, Verhalten in `js/game/`, Zeichnungen in `js/graphics/`.
4. Testen:
   ```bash
   python3 tools/bundle.py && node tests/smoke-test.js && GOD=1 node tests/smoke-test.js
   ```
5. `VERSION` in `js/main.js` hochzählen, `CHANGELOG.md` und `docs/IDEEN.md` aktualisieren.
6. Kurz und auf Deutsch berichten: was neu ist, wo man es einstellt, was Lukas testen soll.

## Stil
- Grafik: flache Cartoon-Formen mit dunkler Kontur (`LOOK.outline`), Licht über `lighting.js`, keine Emojis.
- Spielgefühl: viel Feedback (Treffer-Blitz, Partikel, Zahlen, Bildschirmwackeln, Sound), aber flüssig auf dem iPhone.
- Neue Inhalte immer mit Symbol (`graphics/icons.js`) und Sound (`engine/audio.js` → `SFX`).

## Fallen
- Top-Level-Namen müssen projektweit eindeutig sein (Bündel-Werkzeug).
- Neue Dateien in `tools/bundle.py → ORDER` eintragen.
- `G.state` beachten: `menu | play | up | pause | over`.
- Speicherstand-Schlüssel `letzte-nacht-v2` nicht umbenennen.
