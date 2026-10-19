// ============================================================
//  WERKSTATT (dauerhafte Upgrades für Gold)
//  price = Preis der ersten Stufe, jede weitere kostet × PRICE_GROWTH
//  effect wird pro gekaufter Stufe einmal angewendet
// ============================================================
export const SHOP_PRICE_GROWTH = 1.8;

export const SHOP = [
  { id: 'might',  icon: 'might',  name: 'Stärke',        desc: '+5 % Schaden pro Stufe',         max: 5, price: 60,  effect: { stat: 'dmgMul',  op: 'add', value: 0.05 } },
  { id: 'vital',  icon: 'vital',  name: 'Vitalität',     desc: '+10 Leben pro Stufe',            max: 5, price: 60,  effect: { stat: 'max',     op: 'add', value: 10 } },
  { id: 'speed',  icon: 'speed',  name: 'Ausdauer',      desc: '+4 % Tempo pro Stufe',           max: 5, price: 50,  effect: { stat: 'speed',   op: 'mul', value: 1.04 } },
  { id: 'magnet', icon: 'magnet', name: 'Anziehung',     desc: '+10 % Sammelradius pro Stufe',   max: 5, price: 40,  effect: { stat: 'magnet',  op: 'mul', value: 1.1 } },
  { id: 'greed',  icon: 'greed',  name: 'Gier',          desc: '+15 % Gold pro Stufe',           max: 5, price: 80,  effect: { stat: 'goldMul', op: 'add', value: 0.15 } },
  { id: 'revive', icon: 'revive', name: 'Zweites Leben', desc: 'Einmal pro Runde wiederbeleben', max: 1, price: 600, special: 'revive' },
];
