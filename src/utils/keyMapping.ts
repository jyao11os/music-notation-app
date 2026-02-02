import type { KeyMapping } from '../types/music';

// Map computer keyboard keys to piano keys (3 octaves starting from C3)
// Row 1 (Numbers): 1 2 3 4 5 6 7 8 9 0 - = (C3-B3)
// Row 2 (QWERTY): Q W E R T Y U I O P [ ] (C4-B4)
// Row 3 (ASDF): A S D F G H J K L ; ' (C5-B5)
export const KEY_MAPPINGS: KeyMapping[] = [
  // Octave 3
  { key: '1', pitch: 48, label: 'C3' },
  { key: '!', pitch: 49, label: 'C#3' },
  { key: '2', pitch: 50, label: 'D3' },
  { key: '@', pitch: 51, label: 'D#3' },
  { key: '3', pitch: 52, label: 'E3' },
  { key: '4', pitch: 53, label: 'F3' },
  { key: '$', pitch: 54, label: 'F#3' },
  { key: '5', pitch: 55, label: 'G3' },
  { key: '%', pitch: 56, label: 'G#3' },
  { key: '6', pitch: 57, label: 'A3' },
  { key: '^', pitch: 58, label: 'A#3' },
  { key: '7', pitch: 59, label: 'B3' },

  // Octave 4 (Middle C)
  { key: 'q', pitch: 60, label: 'C4' },
  { key: 'w', pitch: 61, label: 'C#4' },
  { key: 'e', pitch: 62, label: 'D4' },
  { key: 'r', pitch: 63, label: 'D#4' },
  { key: 't', pitch: 64, label: 'E4' },
  { key: 'y', pitch: 65, label: 'F4' },
  { key: 'u', pitch: 66, label: 'F#4' },
  { key: 'i', pitch: 67, label: 'G4' },
  { key: 'o', pitch: 68, label: 'G#4' },
  { key: 'p', pitch: 69, label: 'A4' },
  { key: '[', pitch: 70, label: 'A#4' },
  { key: ']', pitch: 71, label: 'B4' },
  
  // Octave 5
  { key: 'a', pitch: 72, label: 'C5' },
  { key: 's', pitch: 73, label: 'C#5' },
  { key: 'd', pitch: 74, label: 'D5' },
  { key: 'f', pitch: 75, label: 'D#5' },
  { key: 'g', pitch: 76, label: 'E5' },
  { key: 'h', pitch: 77, label: 'F5' },
  { key: 'j', pitch: 78, label: 'F#5' },
  { key: 'k', pitch: 79, label: 'G5' },
  { key: 'l', pitch: 80, label: 'G#5' },
  { key: ';', pitch: 81, label: 'A5' },
  { key: "'", pitch: 82, label: 'A#5' },
  { key: 'z', pitch: 83, label: 'B5' },

  // Extra high C
  { key: 'x', pitch: 84, label: 'C6' },
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
