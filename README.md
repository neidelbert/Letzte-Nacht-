# 🧟 Letzte Nacht

Zombie-Survival fürs iPhone, direkt im Browser spielbar.
Laufen mit dem Daumen, geschossen wird automatisch. Sammle Kristalle, wähle Upgrades und überlebe so lange wie möglich.

**Idee & Game-Design:** Lukas (neidelbert) · **Programmierung:** Claude

## Spielen
- **Online:** https://neidelbert.github.io/Letzte-Nacht-/ (GitHub Pages) – Einrichtung siehe [docs/GITHUB-ANLEITUNG.md](docs/GITHUB-ANLEITUNG.md)
- **Als eine Datei:** `dist/letzte-nacht.html` öffnen

## Projekt-Aufbau
```
index.html            Startseite
css/style.css         Aussehen der Menüs
js/config/            ⭐ ALLE EINSTELLUNGEN – hier änderst du das Spiel
js/engine/            Technik: Sound, Steuerung, Speichern, Bildschirm
js/graphics/          Zeichnungen: Figuren, Boden, Licht, Symbole
js/game/              Spielregeln: Gegner, Waffen, Erfahrung, Zeichnen
js/ui/                Menüs und Anzeige
dist/                 Fertiges Spiel als EINE Datei
tools/bundle.py       Baut dist/letzte-nacht.html
tests/smoke-test.js   Automatischer Test
docs/                 Anleitungen und Ideen
CLAUDE.md             Regeln für die KI, die am Spiel arbeitet
.claude/skills/       Skill für Claude
```

👉 **Was will ich ändern und wo?** Siehe [docs/AENDERN.md](docs/AENDERN.md)

Version: siehe [CHANGELOG.md](CHANGELOG.md)
