export interface Note {
  pitch: number;        // MIDI note number (0-127)
  duration: number;     // In beats (e.g., 1 = quarter note, 0.5 = eighth note)
  startTime: number;    // Position in beats from start
  velocity?: number;    // Note velocity (0-127), default 80
  lyric?: string;       // Associated lyric syllable
}

export interface TimeSignature {
  numerator: number;    // Top number (e.g., 4 in 4/4)
  denominator: number;  // Bottom number (e.g., 4 in 4/4)
  startTime: number;    // When this time signature starts (in beats)
}

export interface KeySignature {
  key: number;          // -7 to 7 (flats to sharps), 0 = C major
  startTime: number;    // When this key signature starts (in beats)
}

export interface NotationData {
  notes: Note[];
  timeSignatures: TimeSignature[];
  keySignatures: KeySignature[];
  tempo: number;        // BPM (beats per minute)
  instrument: string;   // MIDI instrument name
  lyrics: string[];     // Array of lyric syllables aligned with notes
}

export type NotationType = 'staff' | 'jianpu';

export interface KeyMapping {
  key: string;          // Keyboard key (e.g., 'a', 'w')
  pitch: number;        // MIDI note number
  label: string;        // Display label (e.g., 'C4', 'C#4')
}

export const INSTRUMENTS = [
  { value: 'piano', label: 'Piano' },
  { value: 'guitar', label: 'Guitar' },
  { value: 'violin', label: 'Violin' },
  { value: 'flute', label: 'Flute' },
  { value: 'trumpet', label: 'Trumpet' },
  { value: 'clarinet', label: 'Clarinet' },
  { value: 'saxophone', label: 'Saxophone' },
  { value: 'cello', label: 'Cello' },
];

export const DEFAULT_NOTATION_DATA: NotationData = {
  notes: [],
  timeSignatures: [{ numerator: 4, denominator: 4, startTime: 0 }],
  keySignatures: [{ key: 0, startTime: 0 }],
  tempo: 120,
  instrument: 'piano',
  lyrics: [],
};
