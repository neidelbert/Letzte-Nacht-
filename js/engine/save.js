// Speicherstand im iPhone-Browser (Gold, Werkstatt, Charaktere, Rekord)
const SAVE_KEY = 'letzte-nacht-v2';
export const save = { gold: 0, shop: {}, chars: { jack: true }, sel: 'jack', best: null, muted: false };
try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s) Object.assign(save, s); } catch (e) {}
export function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }
export const shopLv = id => save.shop[id] || 0;
