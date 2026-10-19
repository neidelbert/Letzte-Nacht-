// ============================================================
//  BILDER & ANIMATION
//  Die Bilder liegen in grafik/ (Originale). Nach dem Austauschen:
//  python3 tools/art.py && python3 tools/bundle.py
//
//  size  = Höhe der Figur im Spiel (Pixel)
//  speed = Schritte pro Sekunde
//  sway  = Wackeln beim Laufen (Neigung, 0.1 ≈ 6 Grad)
//  hop   = wie hoch die Figur beim Schritt hüpft (Pixel)
//  squash= wie stark sie beim Aufsetzen gestaucht wird (0.1 = 10 %)
//  lean  = Vorbeugen in Laufrichtung (Neigung)
//  Held: breathe = Atmen im Stehen, kick = Rückstoß beim Schießen (Pixel), stepScale = Schritt-Tempo
// ============================================================
export const ANIM = {
  player:   { size: 72,  sway: 0.08, hop: 4,   squash: 0.07, lean: 0.06, breathe: 0.025, kick: 5, stepScale: 0.6 },
  walker:   { size: 64,  speed: 3.2, sway: 0.10, hop: 1.5, squash: 0.04, lean: 0.06 },
  infected: { size: 64,  speed: 3.6, sway: 0.11, hop: 1.5, squash: 0.04, lean: 0.07 },
  runner:   { size: 60,  speed: 7,   sway: 0.07, hop: 4,   squash: 0.08, lean: 0.16 },
  dog:      { size: 46,  speed: 6,   sway: 0.12, hop: 5,   squash: 0.10, lean: 0 },
  brute:    { size: 100, speed: 1.8, sway: 0.06, hop: 2,   squash: 0.08, lean: 0.04 },
  boss:     { size: 168, speed: 1.2, sway: 0.05, hop: 3,   squash: 0.09, lean: 0.03, glow: 'rgba(170,80,255,.45)' },

  hitSquash: 0.14,   // Gegner wird bei Treffer kurz breitgedrückt
  death: 0.45,       // Sekunden, die ein besiegter Gegner umkippt und verblasst
  maxCorpses: 60,    // höchstens so viele umkippende Gegner gleichzeitig (Leistung)

  // Fundstücke
  gemSize: [16, 19, 24],  // kleiner (blau), mittlerer (lila), großer (gold) Kristall
  coinSize: 18,
  dropSize: 34,           // Medikit, Magnet, Bombe
  bob: 3,                 // Auf-und-ab-Schweben (Pixel)
  sawSize: 44, boomerangSize: 34, grenadeSize: 22,

  groundTile: 512,  // Größe der Boden-Kachel im Spiel (Pixel)
  fog: { count: 6, alpha: 0.10, speed: 14 }, // Nebelschwaden über dem Friedhof (count 0 = aus)
};
