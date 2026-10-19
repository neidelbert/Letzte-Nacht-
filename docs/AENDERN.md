# ✏️ Was ändere ich wo?

Alles Wichtige steht in **`js/config/`**. Dort sind nur Zahlen, Namen und Farben. Du kannst nichts kaputt machen, solange du Kommas und Anführungszeichen stehen lässt.

| Ich will …                                   | Datei                    | Was ändern                       |
|----------------------------------------------|--------------------------|----------------------------------|
| das Spiel leichter oder schwerer machen      | `config/balance.js`      | `spawn`, `enemyScaling`, `player.hp` |
| den Riesen früher oder öfter                 | `config/balance.js`      | `boss.firstAt`, `boss.every`     |
| mehr oder weniger Gold                       | `config/balance.js`      | `drops.coinChance`, `gold`       |
| schneller aufsteigen                         | `config/balance.js`      | `xp`                             |
| dass es heller oder dunkler ist              | `config/balance.js`      | `light.darkness`                 |
| eine Waffe stärker machen                    | `config/weapons.js`      | `damage`, `cooldown`             |
| Gegner schneller, zäher, häufiger            | `config/enemies.js`      | `speed`, `hp`, `weight`          |
| Preise für Charaktere                        | `config/characters.js`   | `price`                          |
| neuen Charakter (mit vorhandenen Hüten)      | `config/characters.js`   | Block kopieren, `id` ändern      |
| Werkstatt-Preise oder -Effekte               | `config/shop.js`         | `price`, `effect`, `max`         |
| Upgrades beim Stufenaufstieg                 | `config/passives.js`     | `value`                          |
| Farben von Zombies, Boden, Kristallen        | `config/look.js`         | Farbcodes                        |
| Lautstärke, Musiktempo                       | `config/sound.js`        | `master`, `music`, `tempo`       |
| Texte im Spiel                               | `config/texts.js`        | Text in Anführungszeichen        |
| Menü-Farben und Schrift                      | `css/style.css`          | Variablen oben (`--accent` usw.) |

## So liest du die Waffenwerte
```js
damage: [18, 23, 28, 33, 38]   // Stufe 1 → 18 Schaden, Stufe 5 → 38
cooldown: [0.55, 0.52, ...]    // Sekunden zwischen Schüssen – kleiner = schneller
```

## Größere Änderungen (neue Waffe, neuer Gegner, neue Grafik)
Das macht am besten Claude. Sag einfach, was du willst, zum Beispiel:
> „Neue Waffe: Armbrust, schießt langsam, aber durchbohrt 5 Zombies.“

Claude weiß über `CLAUDE.md` und den Skill, wo alles hingehört.
