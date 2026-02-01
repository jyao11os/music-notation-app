import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, Annotation } from 'vexflow';
import { NotationData } from '../types/music';
import './Notation.css';

interface StaffNotationProps {
  notationData: NotationData;
}

const StaffNotation: React.FC<StaffNotationProps> = ({ notationData }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || notationData.notes.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    try {
      const renderer = new Renderer(
        containerRef.current,
        Renderer.Backends.SVG
      );

      renderer.resize(800, 200);
      const context = renderer.getContext();

      const stave = new Stave(10, 40, 780);
      stave.addClef('treble');
      stave.addTimeSignature(
        `${notationData.timeSignatures[0].numerator}/${notationData.timeSignatures[0].denominator}`
      );
      stave.setContext(context).draw();

      // Convert notes to VexFlow format
      const vexNotes: StaveNote[] = [];
      
      notationData.notes.forEach((note, index) => {
        const octave = Math.floor(note.pitch / 12) - 1;
        const noteValue = note.pitch % 12;
        const noteNames = ['c', 'c', 'd', 'd', 'e', 'f', 'f', 'g', 'g', 'a', 'a', 'b'];
        const noteName = noteNames[noteValue];
        
        // Determine duration (simplified)
        let duration = '4'; // quarter note
        if (note.duration >= 4) duration = 'w'; // whole note
        else if (note.duration >= 2) duration = 'h'; // half note
        else if (note.duration >= 1) duration = 'q'; // quarter note
        else if (note.duration >= 0.5) duration = '8'; // eighth note
        else duration = '16'; // sixteenth note

        const staveNote = new StaveNote({
          keys: [`${noteName}/${octave}`],
          duration: duration,
        });

        // Add accidentals for sharps
        const accidentalNotes = [1, 3, 6, 8, 10]; // C#, D#, F#, G#, A#
        if (accidentalNotes.includes(noteValue)) {
          staveNote.addModifier(new Accidental('#'), 0);
        }

        // Add lyric if present
        if (note.lyric) {
          staveNote.addAnnotation(0, 
            new Annotation(note.lyric).setVerticalJustification(Annotation.VerticalJustify.BOTTOM)
          );
        }

        vexNotes.push(staveNote);
      });

      if (vexNotes.length > 0) {
        const voice = new Voice({
          num_beats: notationData.timeSignatures[0].numerator,
          beat_value: notationData.timeSignatures[0].denominator,
        });
        voice.setStrict(false);
        voice.addTickables(vexNotes);

        new Formatter().joinVoices([voice]).format([voice], 700);
        voice.draw(context, stave);
      }
    } catch (error) {
      console.error('Error rendering staff notation:', error);
    }
  }, [notationData]);

  return (
    <div className="notation-container">
      <div ref={containerRef} className="notation-canvas"></div>
      {notationData.notes.length === 0 && (
        <div className="notation-empty">No notes to display</div>
      )}
    </div>
  );
};

export default StaffNotation;
