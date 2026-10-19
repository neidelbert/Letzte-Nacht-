// ============================================================
//  SOUND & MUSIK (alles wird live erzeugt, keine Dateien)
// ============================================================
export const SOUND = {
  master: 0.6, effects: 0.8, music: 0.32,
  tempo: 0.24,          // Sekunden pro Musik-Schritt (kleiner = schneller)
  tempoLate: 0.2,       // Tempo ab lateAfter Sekunden
  lateAfter: 180,
  melodyAfter: 90,      // ab hier spielt eine zweite Stimme mit
  bassline: [45, 45, 57, 45, 43, 43, 55, 43, 41, 41, 53, 41, 40, 40, 52, 44], // MIDI-Noten
};
