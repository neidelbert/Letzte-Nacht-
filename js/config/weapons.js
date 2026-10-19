// ============================================================
//  WAFFEN
//  Listen wie [a, b, c, d, e] = Wert für Stufe 1 bis 5.
//  Einzelne Zahl = gilt für alle Stufen.
//  cooldown = Sekunden zwischen zwei Angriffen (kleiner = schneller)
// ============================================================
export const WEAPONS = {
  revolver: {
    name: 'Revolver', desc: 'Schießt auf den nächsten Zombie', upgrade: 'Mehr Schaden, mehr Kugeln',
    cooldown: [0.55, 0.52, 0.49, 0.46, 0.43], damage: [18, 23, 28, 33, 38],
    bullets: [1, 1, 2, 2, 3], pierce: [0, 0, 0, 1, 1],
    speed: 660, lifetime: 0.95, knockback: 6, spread: 0.12, range: 0.7,
  },
  shotgun: {
    name: 'Schrotflinte', desc: 'Breiter Schrotkegel mit Rückstoß', upgrade: 'Mehr Schrot, schneller nachladen',
    cooldown: [1.22, 1.14, 1.06, 0.98, 0.9], damage: [11, 14, 17, 20, 23], pellets: [5, 6, 7, 8, 9],
    spread: 0.32, speedMin: 600, speedMax: 780, lifeMin: 0.28, lifeMax: 0.38, knockback: 16, range: 320,
  },
  flamer: {
    name: 'Flammenwerfer', desc: 'Dauerfeuer auf kurze Distanz', upgrade: 'Längere, heißere Flamme',
    length: [126, 142, 158, 174, 190], damage: [5.2, 7.4, 9.6, 11.8, 14], tick: 0.13, cone: 0.42,
  },
  boomerang: {
    name: 'Bumerang', desc: 'Fliegt raus und kommt zurück', upgrade: 'Mehr Schaden, mehr Bumerangs',
    cooldown: [1.58, 1.46, 1.34, 1.22, 1.1], damage: [17, 22, 27, 32, 37], count: [1, 1, 2, 2, 2],
    distance: [252, 274, 296, 318, 340], speed: 430, returnSpeed: 560, range: 420, hitDelay: 0.35,
  },
  saws: {
    name: 'Kreissägen', desc: 'Sägen kreisen um dich', upgrade: 'Noch eine Säge, mehr Schaden',
    count: [2, 3, 4, 5, 6], damage: [12, 16, 20, 24, 28], radius: 78, spin: [3.6, 3.8, 4.0, 4.2, 4.4], hitDelay: 0.3,
  },
  zap: {
    name: 'Kettenblitz', desc: 'Springt von Zombie zu Zombie', upgrade: 'Mehr Sprünge, öfter',
    cooldown: [2.0, 1.7, 1.4, 1.1, 0.8], damage: [26, 34, 42, 50, 58], jumps: [3, 4, 5, 6, 7], jumpRange: 170, range: 420,
  },
  grenade: {
    name: 'Granaten', desc: 'Explodieren mitten in der Horde', upgrade: 'Größere Explosion, mehr Granaten',
    cooldown: [2.18, 1.96, 1.74, 1.52, 1.3], damage: [35, 46, 57, 68, 79], count: [1, 2, 2, 3, 3],
    radius: [68, 78, 88, 98, 108], flightTime: 0.6, range: 380,
  },
  aura: {
    name: 'Giftwolke', desc: 'Schadet allem um dich herum', upgrade: 'Größere Wolke, mehr Schaden',
    radius: [68, 80, 92, 104, 116], damage: [7, 10, 13, 16, 19], tick: 0.45,
  },
};
