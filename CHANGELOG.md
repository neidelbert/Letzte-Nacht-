# Änderungen

## 2.2.0 – 19.10.2026
- Neues Grafikpaket: alle Charaktere, Zombies, Waffen-/Upgrade-Symbole, Kristalle, Gold, Medikit, Magnet und Friedhof-Boden als Bilder
- Animation für alles: Laufen mit Wackeln, Hüpfen und Stauchen, Atmen im Stehen, Rückstoß beim Schießen, Treffer-Blitz mit Stauchen, Gegner kippen beim Tod um, Boss mit pulsierendem Leuchten
- Fundstücke schweben, Kristalle glitzern, Münzen drehen sich, Sägen/Bumerang/Granaten drehen sich als Bild
- Nebelschwaden ziehen über den Friedhof
- Menüs: Symbole schweben, Held atmet, Upgrade-Karten fliegen herein
- Neuer Charakter **Noah** (Späher, Schrotflinte, +10 % Tempo, 350 Gold)
- Neuer Gegner **Renner** (schnell, wenig Leben, ab 0:30); Zombies haben jetzt zwei Looks
- Einstellungen für Größe und Animation: `js/config/anim.js`

## 2.1.0 – 18.10.2026
- Projekt neu geordnet: alle Werte in `js/config/` (Waffen, Gegner, Charaktere, Werkstatt, Farben, Texte, Sound)
- Waffenwerte jetzt als Liste pro Stufe → leicht einstellbar
- Gegner-Häufigkeit über `weight` und `appearsAfter`
- Bündel-Werkzeug (`tools/bundle.py`) und automatischer Test (`tests/smoke-test.js`)
- Anleitungen in `docs/`, Regeln für Claude in `CLAUDE.md`, Projekt-Skill

## 2.0.0
- Eigene Grafik ohne Emojis, Licht und Dunkelheit
- 8 Waffen, 8 passive Upgrades, 5 Charaktere, Werkstatt mit Gold
- Synthetischer Sound und Musik

## 1.0.0
- Erste Version mit Emoji-Grafik
