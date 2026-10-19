// ============================================================
//  SPIELBALANCE – das wichtigste Stellrad des Spiels.
//  Zahlen ändern, speichern, Seite neu laden. Fertig.
// ============================================================
export const BALANCE = {
  // Dein Held zu Rundenbeginn
  player: {
    hp: 100,              // Start-Leben
    speed: 170,           // Lauftempo (Pixel pro Sekunde)
    magnet: 80,           // Sammelradius für Kristalle und Gold
    hitInvulnerable: 0.5, // Sekunden unverwundbar nach einem Treffer
    radius: 14,           // Größe der Trefferzone
  },

  // Wie viele Gegner pro Sekunde erscheinen
  spawn: {
    startPerSecond: 1.1,  // am Anfang
    risePerSecond: 1 / 14,// steigt so viel pro Sekunde
    curveEvery: 60,       // zusätzlicher Anstieg …
    curvePower: 1.6,      // … der mit der Zeit immer steiler wird
    maxPerSecond: 14,     // Obergrenze
    maxEnemies: 240,      // höchstens so viele gleichzeitig (Handy-Leistung!)
  },

  // Gegner werden mit der Zeit stärker
  enemyScaling: {
    hpDoublesEvery: 75,      // alle X Sekunden +100 % Leben
    bossHpDoublesEvery: 220, // dasselbe für den Riesen
    speedBonusMax: 0.5,      // höchstens +50 % Tempo
    speedBonusEvery: 420,    // erreicht nach X Sekunden
  },

  boss: { firstAt: 120, every: 120 },                  // Riese: erstes Mal und danach alle X Sekunden
  batSwarm: { after: 45, chancePerSecond: 0.035, size: 10 },

  // Erfahrung bis zur nächsten Stufe: first + Stufe*perLevel + Stufe^curve
  xp: { first: 5, perLevel: 3.2, curve: 1.45 },

  // Was Gegner fallen lassen (0.09 = 9 %)
  drops: {
    coinChance: 0.09, healChance: 0.012, magnetChance: 0.006, bombChance: 0.004,
    healPercent: 0.3,   // Hähnchen/Medikit heilt 30 % deines Max-Lebens
    bossCoins: 20, bossGems: 16,
  },

  // Gold am Rundenende
  gold: { bonusEverySeconds: 10, bonusEveryKills: 25, levelUpBag: 25 },

  limits: { maxWeapons: 6, maxWeaponLevel: 5, maxPassiveLevel: 5 },

  revive: { hpPercent: 0.5, clearRadius: 260, invulnerable: 2 },

  light: { playerRadius: 280, darkness: 0.6 }, // darkness: 0 = Tag, 1 = stockfinster
};
