// ============================================================
//  PASSIVE UPGRADES (beim Stufenaufstieg wählbar)
//  op: 'mul' = malnehmen (1.15 = +15 %), 'add' = dazuzählen
//  Werte (stat): dmgMul, cdMul, speed, max, magnet, regen, armor, area, goldMul
// ============================================================
export const PASSIVES = {
  might:  { name: 'Muskelkraft',     desc: '+15 % Schaden',                 effect: { stat: 'dmgMul', op: 'mul', value: 1.15 } },
  haste:  { name: 'Schnellladen',    desc: '−10 % Abklingzeit',             effect: { stat: 'cdMul',  op: 'mul', value: 0.9 } },
  boots:  { name: 'Laufschuhe',      desc: '+10 % Tempo',                   effect: { stat: 'speed',  op: 'mul', value: 1.1 } },
  heart:  { name: 'Dickes Fell',     desc: '+20 Leben, voll geheilt',       effect: { stat: 'max',    op: 'add', value: 20 }, healFull: true },
  magnet: { name: 'Magnet',          desc: '+40 % Sammelradius',            effect: { stat: 'magnet', op: 'mul', value: 1.4 } },
  regen:  { name: 'Erste Hilfe',     desc: '+0,6 Leben pro Sekunde',        effect: { stat: 'regen',  op: 'add', value: 0.6 } },
  armor:  { name: 'Panzerweste',     desc: '−1 Schaden pro Treffer',        effect: { stat: 'armor',  op: 'add', value: 1 } },
  area:   { name: 'Wirkungsbereich', desc: '+12 % Fläche für Flächenwaffen', effect: { stat: 'area',   op: 'mul', value: 1.12 } },
};
