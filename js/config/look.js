// ============================================================
//  AUSSEHEN – alle Farben an einem Ort (Hex-Farbcodes)
// ============================================================
export const LOOK = {
  outline: '#0f1118',
  eyes: '#ff4a36',
  zombies: [
    { skin: '#86ad6c', shirt: '#5a4b6e', pants: '#3b3a44' },
    { skin: '#97b07c', shirt: '#6e5040', pants: '#44392e' },
    { skin: '#73a07a', shirt: '#3f5a6e', pants: '#2f3b40' },
  ],
  dog: { fur: '#4b4039', dark: '#3a312b', snout: '#5a4d44' },
  bat: { wing: '#3b2f4a', body: '#4a3b5c' },
  brute: { skin: '#7d8f6a', body: '#5f4f6e', pants: '#34303a' },
  boss: { body: '#8e2b24', belly: '#b8443a', feet: '#4a1612', horns: '#e8dcc2', eyes: '#ffd84a' },
  gems: { small: '#4fa3ff', mid: '#b77cff', big: '#f2b14d' },
  coin: '#f2b94a',
  ground: {
    base: '#1f2b25', patchLight: 'rgba(45,66,50,.55)', patchDark: 'rgba(18,28,24,.5)', dirt: 'rgba(72,60,46,.55)',
    grassA: 'rgba(96,140,96,.35)', grassB: 'rgba(60,90,66,.45)', stone: 'rgba(130,134,140,.32)',
    graveA: '#626a76', graveB: '#565e69', tree: '#3e3128',
    graveChance: 0.55, treeChance: 0.16,
  },
  night: '4,7,20', // Farbe der Dunkelheit (R,G,B)
};
