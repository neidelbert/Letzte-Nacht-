// ============================================================
//  GEGNER
//  appearsAfter = ab Sekunde X dabei
//  weight       = wie oft er gewählt wird (höher = häufiger)
//  Bilder: grafik/zombies/<id>.png, Größe und Animation in anim.js
//  Der normale Zombie hat zwei Looks: walker.png und infected.png
// ============================================================
export const ENEMIES = {
  walker: { name: 'Zombie',     hp: 18, speed: 52,  damage: 10, xp: 1, radius: 15, appearsAfter: 0,  weight: 52 },
  runner: { name: 'Renner',     hp: 12, speed: 98,  damage: 8,  xp: 1, radius: 14, appearsAfter: 30, weight: 14 },
  bat:    { name: 'Fledermaus', hp: 8,  speed: 120, damage: 6,  xp: 1, radius: 11, appearsAfter: 20, weight: 16, zigzag: 0.7 },
  dog:    { name: 'Zombiewolf', hp: 16, speed: 108, damage: 9,  xp: 2, radius: 15, appearsAfter: 40, weight: 16 },
  brute:  { name: 'Troll',      hp: 95, speed: 40,  damage: 20, xp: 5, radius: 24, appearsAfter: 75, weight: 10, knockbackResist: 0.6 },
};

// Der Boss kommt nach Zeitplan (siehe balance.js → boss)
export const BOSS = { name: 'Riese', hp: 1500, speed: 46, damage: 30, xp: 40, radius: 44 };
