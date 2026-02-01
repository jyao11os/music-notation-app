# Music Notation Studio

A professional music notation application for macOS that supports keyboard-based music input, MIDI playback/saving, dual notation systems (staff and numbered), PDF export, and bilingual UI (English/Simplified Chinese).

## Features

### Core Functionality
- **Keyboard Input**: Play notes using your computer keyboard (mapped to piano keys)
- **Real-time Recording**: Record notes as you play them
- **Dual Notation Systems**: 
  - Standard five-line staff notation (Western notation)
  - Numbered musical notation (Jianpu/简谱)
- **MIDI Support**: 
  - Play back recorded compositions
  - Save compositions as MIDI files
  - Configurable tempo and instruments
- **Lyrics Support**: Add and edit lyrics synchronized with notes
- **Note Editing**: Full editing capabilities for notes (pitch, duration) and lyrics
- **PDF Export**: Export your compositions as PDF files
- **Bilingual UI**: Switch between English and Simplified Chinese

### Design Principles
- Clean, professional interface
- No AI-like design elements (no emojis, gradient colors, or oversized buttons)
- Neutral color palette focused on functionality
- Intuitive user experience

## Installation

### Prerequisites
- macOS 10.13 or later
- Node.js 18+ and pnpm (for development)

### Development Setup

1. Clone or extract the project:
```bash
cd music-notation-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Run in development mode:
```bash
pnpm dev
```

### Building for macOS

To create a distributable macOS application:

```bash
pnpm build
```

This will create a `.dmg` file in the `release` directory that can be installed on macOS.

## Usage

### Keyboard Mapping

The computer keyboard is mapped to piano keys across 2 octaves (C4-F5):

**White Keys (Natural Notes)**:
- A = C4 (Middle C)
- S = D4
- D = E4
- F = F4
- G = G4
- H = A4
- J = B4
- K = C5
- L = D5
- ; = E5
- ' = F5

**Black Keys (Sharps/Flats)**:
- W = C#4
- E = D#4
- T = F#4
- Y = G#4
- U = A#4
- O = C#5
- P = D#5

### Recording Music

1. Click the **Record** button to start recording
2. Play notes using your keyboard
3. Click **Record** again to stop recording
4. Your notes will appear in the notation view

### Editing Notes and Lyrics

1. Use the **Note & Lyric Editor** panel to modify recorded notes
2. Change pitch, duration, or delete individual notes
3. Add lyrics in the text area (space-separated for each note)
4. Individual note lyrics can be edited in each note's row

### Playback

1. Click **Play** to hear your composition
2. Use **Pause** to pause playback
3. Use **Stop** to stop and reset playback
4. Adjust tempo using the slider (40-240 BPM)

### Switching Notation Systems

Click the **Staff Notation** or **Numbered Notation** button to switch between Western staff notation and Chinese Jianpu notation.

### Exporting

- **Save MIDI**: Click to download your composition as a `.mid` file
- **Export PDF**: Click to export your notation as a PDF document

### Language

Click the language button to toggle between English and Simplified Chinese.

## Technical Stack

- **Framework**: Electron + React + TypeScript
- **Music Notation**: 
  - VexFlow (staff notation)
  - JianpuRender (numbered notation)
- **MIDI**: Tone.js + @tonejs/midi
- **PDF Export**: jsPDF + html2canvas
- **Internationalization**: i18next + react-i18next

## Project Structure

```
music-notation-app/
├── electron/              # Electron main process
│   └── main.ts
├── src/
│   ├── components/        # React components
│   │   ├── Keyboard.tsx
│   │   ├── StaffNotation.tsx
│   │   ├── JianpuNotation.tsx
│   │   ├── Controls.tsx
│   │   └── NoteEditor.tsx
│   ├── services/          # Business logic
│   │   ├── MIDIService.ts
│   │   └── PDFExportService.ts
│   ├── types/             # TypeScript types
│   │   └── music.ts
│   ├── utils/             # Utilities
│   │   ├── keyMapping.ts
│   │   └── i18n.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

## Development Notes

### Running as Web App

The application can also run as a web application (without Electron):

```bash
pnpm exec vite
```

Then open `http://localhost:5173` in your browser.

### Known Limitations

- Audio context requires user interaction (click/key press) to start
- MIDI playback uses Web Audio API synthesis (not actual MIDI devices)
- PDF export captures the visual representation of the notation

## Future Enhancements

See the feasibility analysis document for potential audio-to-MIDI transcription feature.

## License

This project is provided as-is for educational and personal use.
