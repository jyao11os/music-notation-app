import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Keyboard from './components/Keyboard';
import StaffNotation from './components/StaffNotation';
import JianpuNotation from './components/JianpuNotation';
import Controls from './components/Controls';
import NoteEditor from './components/NoteEditor';
import MIDIService from './services/MIDIService';
import PDFExportService from './services/PDFExportService';
import { NotationData, NotationType, DEFAULT_NOTATION_DATA, Note } from './types/music';
import './App.css';

function App() {
  const { t } = useTranslation();
  const [notationData, setNotationData] = useState<NotationData>(DEFAULT_NOTATION_DATA);
  const [notationType, setNotationType] = useState<NotationType>('staff');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const notationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize MIDI service
    MIDIService.initialize();

    return () => {
      MIDIService.dispose();
    };
  }, []);

  const handleNotePlay = (pitch: number) => {
    MIDIService.playNote(pitch);

    if (isRecording) {
      const newNote: Note = {
        pitch,
        duration: 1, // Default quarter note
        startTime: currentTime,
        velocity: 80,
      };

      setNotationData(prev => ({
        ...prev,
        notes: [...prev.notes, newNote],
      }));

      setCurrentTime(prev => prev + 1);
    }
  };

  const handleNoteStop = (pitch: number) => {
    MIDIService.stopNote(pitch);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    MIDIService.playSequence(notationData);
  };

  const handlePause = () => {
    setIsPlaying(false);
    MIDIService.pauseSequence();
  };

  const handleStop = () => {
    setIsPlaying(false);
    MIDIService.stopSequence();
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setCurrentTime(0);
    } else {
      setIsRecording(true);
      setCurrentTime(0);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all notes?')) {
      setNotationData(DEFAULT_NOTATION_DATA);
      setCurrentTime(0);
      setIsRecording(false);
      setIsPlaying(false);
      MIDIService.stopSequence();
    }
  };

  const handleSaveMidi = () => {
    MIDIService.downloadMIDI(notationData, 'composition.mid');
  };

  const handleExportPdf = async () => {
    if (notationRef.current) {
      try {
        await PDFExportService.exportToPDF(
          notationRef.current,
          notationData,
          notationType,
          'music-notation.pdf'
        );
      } catch (error) {
        alert('Failed to export PDF. Please try again.');
      }
    }
  };

  const handleTempoChange = (tempo: number) => {
    setNotationData(prev => ({ ...prev, tempo }));
  };

  const handleInstrumentChange = (instrument: string) => {
    setNotationData(prev => ({ ...prev, instrument }));
  };

  const handleNotesChange = (notes: Note[]) => {
    setNotationData(prev => ({ ...prev, notes }));
  };

  const handleLyricsChange = (lyrics: string[]) => {
    setNotationData(prev => ({ ...prev, lyrics }));
  };

  const handleLanguageChange = (lang: string) => {
    // Language change is handled by i18next
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">{t('appTitle')}</h1>
        <p className="app-subtitle">{t('pressKeysToPlay')}</p>
      </header>

      <main className="app-main">
        <div className="app-grid">
          <div className="app-section">
            <h2 className="section-heading">{t('keyboard')}</h2>
            <Keyboard onNotePlay={handleNotePlay} onNoteStop={handleNoteStop} />
          </div>

          <div className="app-section">
            <h2 className="section-heading">{t('notation')}</h2>
            <div ref={notationRef}>
              {notationType === 'staff' ? (
                <StaffNotation notationData={notationData} />
              ) : (
                <JianpuNotation notationData={notationData} />
              )}
            </div>
          </div>

          <div className="app-section">
            <h2 className="section-heading">Note & Lyric Editor</h2>
            <NoteEditor
              notes={notationData.notes}
              onNotesChange={handleNotesChange}
              onLyricsChange={handleLyricsChange}
            />
          </div>

          <div className="app-section">
            <Controls
              notationData={notationData}
              notationType={notationType}
              isRecording={isRecording}
              isPlaying={isPlaying}
              onNotationTypeChange={setNotationType}
              onTempoChange={handleTempoChange}
              onInstrumentChange={handleInstrumentChange}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              onRecord={handleRecord}
              onClear={handleClear}
              onSaveMidi={handleSaveMidi}
              onExportPdf={handleExportPdf}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
