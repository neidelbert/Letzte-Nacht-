// Der komplette Spielzustand an einem Ort. Alle Module lesen und schreiben hier.
export const G = {
  state: 'menu',        // menu | play | up (Stufenaufstieg) | pause | over
  P: null,              // Spieler
  S: null,              // aktuelle Werte (Schaden, Tempo, …)
  W: {},                // Waffen, die der Spieler hat: { revolver: { lvl, cd } }
  PL: {},               // passive Upgrades: { might: 2 }
  char: null,
  enemies: [], bullets: [], booms: [], nades: [], gems: [], coins: [], drops: [],
  parts: [], fires: [], texts: [], bolts: [], decals: [], lights: [], corpses: [],
  t: 0, kills: 0, lvl: 1, xp: 0, next: 5, spawnAcc: 0, sawAng: 0, shake: 0, hurt: 0,
  nextBoss: 0, runGold: 0, revived: false, pendingUps: 0, menuT: 0, gemComboT: 0,
};
