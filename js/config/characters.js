// ============================================================
//  CHARAKTERE
//  weapon = Startwaffe (Name aus weapons.js)
//  price  = Gold zum Freischalten (0 = gratis)
//  bonus  = wie bei passives.js
//  hat    = cowboy | hardhat | mask | medic | beanie
// ============================================================
export const CHARACTERS = [
  { id: 'jack', name: 'Jack', title: 'Cowboy',        bonusText: '+10 % Schaden',               weapon: 'revolver', price: 0,
    bonus: [{ stat: 'dmgMul', op: 'mul', value: 1.1 }],  look: { skin: '#e8b48a', shirt: '#b5462f', pants: '#3b4a6b', hat: 'cowboy' } },
  { id: 'mia',  name: 'Mia',  title: 'Mechanikerin',  bonusText: '+20 % Wirkungsbereich',       weapon: 'saws',     price: 250,
    bonus: [{ stat: 'area', op: 'mul', value: 1.2 }],    look: { skin: '#c98c64', shirt: '#3f7fa8', pants: '#2f3a4a', hat: 'hardhat' } },
  { id: 'paul', name: 'Paul', title: 'Pyro',          bonusText: '+30 Leben',                   weapon: 'flamer',   price: 500,
    bonus: [{ stat: 'max', op: 'add', value: 30 }],      look: { skin: '#e3b08c', shirt: '#5d6b3a', pants: '#3a3326', hat: 'mask' } },
  { id: 'sina', name: 'Sina', title: 'Sanitäterin',   bonusText: 'Heilt 1,5 Leben pro Sekunde', weapon: 'zap',      price: 800,
    bonus: [{ stat: 'regen', op: 'add', value: 1.5 }],   look: { skin: '#f0c4a0', shirt: '#e8e6e0', pants: '#4a5a6a', hat: 'medic' } },
  { id: 'bob',  name: 'Bob',  title: 'Sprengmeister', bonusText: '−15 % Abklingzeit',           weapon: 'grenade',  price: 1200,
    bonus: [{ stat: 'cdMul', op: 'mul', value: 0.85 }],  look: { skin: '#d9a07a', shirt: '#6b4a2b', pants: '#2e2e33', hat: 'beanie' } },
];
