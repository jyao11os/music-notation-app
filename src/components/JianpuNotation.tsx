import React, { useEffect, useRef } from 'react';
import { JianpuSVGRender } from 'jianpurender';
import type { NotationData } from '../types/music';
import './Notation.css';

interface JianpuNotationProps {
  notationData: NotationData;
}

const JianpuNotation: React.FC<JianpuNotationProps> = ({ notationData }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || notationData.notes.length === 0) return;

    // Clear previous content
    containerRef.current.innerHTML = '';

    try {
      const jianpuData = {
        notes: notationData.notes.map(note => ({
          start: note.startTime,
          length: note.duration,
          pitch: note.pitch,
          intensity: (note.velocity || 80) / 127,
        })),
        keySignatures: notationData.keySignatures.map(ks => ({
          start: ks.startTime,
          key: ks.key,
        })),
        timeSignatures: notationData.timeSignatures.map(ts => ({
          start: ts.startTime,
          numerator: ts.numerator,
          denominator: ts.denominator,
        })),
      };

      new JianpuSVGRender(
        jianpuData,
        { noteHeight: 24 },
        containerRef.current
      );

      // Add lyrics if present
      if (notationData.lyrics.length > 0) {
        const lyricsDiv = document.createElement('div');
        lyricsDiv.className = 'jianpu-lyrics';
        lyricsDiv.textContent = notationData.lyrics.join(' ');
        containerRef.current.appendChild(lyricsDiv);
      }
    } catch (error) {
      console.error('Error rendering Jianpu notation:', error);
    }
  }, [notationData]);

  return (
    <div className="notation-container">
      <div ref={containerRef} className="notation-canvas"></div>
      {notationData.notes.length === 0 && (
        <div className="notation-empty">暂无音符显示</div>
      )}
    </div>
  );
};

export default JianpuNotation;
