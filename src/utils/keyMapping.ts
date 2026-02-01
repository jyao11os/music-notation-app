import { KeyMapping } from '../types/music';

// Map computer keyboard keys to piano keys (2 octaves starting from C4)
// White keys: A S D F G H J K L ; '
// Black keys: W E   T Y U   O P
export const KEY_MAPPINGS: KeyMapping[] = [
  // Octave 4 (Middle C)
  { key: 'a', pitch: 60, label: 'C4' },
  { key: 'w', pitch: 61, label: 'C#4' },
  { key: 's', pitch: 62, label: 'D4' },
  { key: 'e', pitch: 63, label: 'D#4' },
  { key: 'd', pitch: 64, label: 'E4' },
  { key: 'f', pitch: 65, label: 'F4' },
  { key: 't', pitch: 66, label: 'F#4' },
  { key: 'g', pitch: 67, label: 'G4' },
  { key: 'y', pitch: 68, label: 'G#4' },
  { key: 'h', pitch: 69, label: 'A4' },
  { key: 'u', pitch: 70, label: 'A#4' },
  { key: 'j', pitch: 71, label: 'B4' },
  
  // Octave 5
  { key: 'k', pitch: 72, label: 'C5' },
  { key: 'o', pitch: 73, label: 'C#5' },
  { key: 'l', pitch: 74, label: 'D5' },
  { key: 'p', pitch: 75, label: 'D#5' },
  { key: ';', pitch: 76, label: 'E5' },
  { key: '\'', pitch: 77, label: 'F5' },
];

export function getPitchFromKey(key: string): number | null {
  const mapping = KEY_MAPPINGS.find(m => m.key === key.toLowerCase());
  return mapping ? mapping.pitch : null;
}

export function getLabelFromPitch(pitch: number): string {
  const mapping = KEY_MAPPINGS.find(m => m.pitch === pitch);
  return mapping ? mapping.label : '';
}

export function isWhiteKey(pitch: number): boolean {
  const note = pitch % 12;
  return [0, 2, 4, 5, 7, 9, 11].includes(note);
}

export function isBlackKey(pitch: number): boolean {
  return !isWhiteKey(pitch);
}

export function midiToNoteName(pitch: number): string {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(pitch / 12) - 1;
  const noteName = noteNames[pitch % 12];
  return `${noteName}${octave}`;
}

export function midiToJianpu(pitch: number, keySignature: number = 0): string {
  // Convert MIDI pitch to Jianpu number (1-7)
  // Assuming C major (keySignature = 0) as base
  const noteInKey = (pitch - 60 + keySignature) % 12;
  const jianpuMap: { [key: number]: string } = {
    0: '1',   // C
    2: '2',   // D
    4: '3',   // E
    5: '4',   // F
    7: '5',   // G
    9: '6',   // A
    11: '7',  // B
    1: '#1',  // C#
    3: '#2',  // D#
    6: '#4',  // F#
    8: '#5',  // G#
    10: '#6', // A#
  };
  return jianpuMap[noteInKey] || '1';
}
