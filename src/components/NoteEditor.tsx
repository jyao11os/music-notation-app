import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Note } from '../types/music';
import { midiToNoteName } from '../utils/keyMapping';
import './NoteEditor.css';

interface NoteEditorProps {
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
  onLyricsChange: (lyrics: string[]) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ notes, onNotesChange, onLyricsChange }) => {
  const { t } = useTranslation();
  const [selectedNoteIndex, setSelectedNoteIndex] = useState<number | null>(null);

  const handleDeleteNote = (index: number) => {
    const newNotes = notes.filter((_, i) => i !== index);
    onNotesChange(newNotes);
    if (selectedNoteIndex === index) {
      setSelectedNoteIndex(null);
    }
  };

  const handlePitchChange = (index: number, newPitch: number) => {
    const newNotes = [...notes];
    newNotes[index] = { ...newNotes[index], pitch: newPitch };
    onNotesChange(newNotes);
  };

  const handleDurationChange = (index: number, newDuration: number) => {
    const newNotes = [...notes];
    newNotes[index] = { ...newNotes[index], duration: newDuration };
    onNotesChange(newNotes);
  };

  const handleLyricChange = (index: number, newLyric: string) => {
    const newNotes = [...notes];
    newNotes[index] = { ...newNotes[index], lyric: newLyric };
    onNotesChange(newNotes);
    
    // Update lyrics array
    const lyrics = newNotes.map(note => note.lyric || '');
    onLyricsChange(lyrics);
  };

  const handleBatchLyricsInput = (lyricsText: string) => {
    const lyricsSplit = lyricsText.trim().split(/\s+/);
    const newNotes = notes.map((note, index) => ({
      ...note,
      lyric: lyricsSplit[index] || note.lyric || '',
    }));
    onNotesChange(newNotes);
    onLyricsChange(lyricsSplit);
  };

  const getDurationLabel = (duration: number): string => {
    if (duration >= 4) return 'Whole';
    if (duration >= 2) return 'Half';
    if (duration >= 1) return 'Quarter';
    if (duration >= 0.5) return 'Eighth';
    return 'Sixteenth';
  };

  return (
    <div className="note-editor-container">
      <div className="editor-header">
        <h3 className="editor-title">Note & Lyric Editor</h3>
        <span className="note-count">{notes.length} notes</span>
      </div>

      {notes.length === 0 ? (
        <div className="editor-empty">{t('noNotesYet')}</div>
      ) : (
        <>
          <div className="batch-lyrics-section">
            <label className="lyrics-label">{t('lyrics')} (space-separated):</label>
            <textarea
              className="lyrics-textarea"
              placeholder="Enter lyrics separated by spaces..."
              value={notes.map(n => n.lyric || '').join(' ')}
              onChange={(e) => handleBatchLyricsInput(e.target.value)}
              rows={3}
            />
          </div>

          <div className="notes-list">
            {notes.map((note, index) => (
              <div
                key={index}
                className={`note-item ${selectedNoteIndex === index ? 'selected' : ''}`}
                onClick={() => setSelectedNoteIndex(index)}
              >
                <div className="note-info">
                  <span className="note-number">#{index + 1}</span>
                  <span className="note-name">{midiToNoteName(note.pitch)}</span>
                  <span className="note-duration">{getDurationLabel(note.duration)}</span>
                </div>

                <div className="note-controls">
                  <div className="control-item">
                    <label>Pitch:</label>
                    <input
                      type="number"
                      min="0"
                      max="127"
                      value={note.pitch}
                      onChange={(e) => handlePitchChange(index, Number(e.target.value))}
                      className="input-small"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="control-item">
                    <label>Duration:</label>
                    <select
                      value={note.duration}
                      onChange={(e) => handleDurationChange(index, Number(e.target.value))}
                      className="select-small"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="4">Whole</option>
                      <option value="2">Half</option>
                      <option value="1">Quarter</option>
                      <option value="0.5">Eighth</option>
                      <option value="0.25">Sixteenth</option>
                    </select>
                  </div>

                  <div className="control-item">
                    <label>Lyric:</label>
                    <input
                      type="text"
                      value={note.lyric || ''}
                      onChange={(e) => handleLyricChange(index, e.target.value)}
                      className="input-small"
                      placeholder="..."
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <button
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(index);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NoteEditor;
