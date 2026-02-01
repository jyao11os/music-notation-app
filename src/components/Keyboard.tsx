import React, { useEffect, useState } from 'react';
import { KEY_MAPPINGS, isWhiteKey } from '../utils/keyMapping';
import './Keyboard.css';

interface KeyboardProps {
  onNotePlay: (pitch: number) => void;
  onNoteStop: (pitch: number) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onNotePlay, onNoteStop }) => {
  const [activeKeys, setActiveKeys] = useState<Set<number>>(new Set());
  const [pressedComputerKeys, setPressedComputerKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (pressedComputerKeys.has(key)) return; // Prevent repeat

      const mapping = KEY_MAPPINGS.find(m => m.key === key);
      if (mapping) {
        setPressedComputerKeys(prev => new Set(prev).add(key));
        setActiveKeys(prev => new Set(prev).add(mapping.pitch));
        onNotePlay(mapping.pitch);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const mapping = KEY_MAPPINGS.find(m => m.key === key);
      if (mapping) {
        setPressedComputerKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
        setActiveKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(mapping.pitch);
          return newSet;
        });
        onNoteStop(mapping.pitch);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNotePlay, onNoteStop, pressedComputerKeys]);

  const handleMouseDown = (pitch: number) => {
    setActiveKeys(prev => new Set(prev).add(pitch));
    onNotePlay(pitch);
  };

  const handleMouseUp = (pitch: number) => {
    setActiveKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(pitch);
      return newSet;
    });
    onNoteStop(pitch);
  };

  const whiteKeys = KEY_MAPPINGS.filter(k => isWhiteKey(k.pitch));
  const blackKeys = KEY_MAPPINGS.filter(k => !isWhiteKey(k.pitch));

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {whiteKeys.map((mapping) => (
          <div
            key={mapping.pitch}
            className={`key white-key ${activeKeys.has(mapping.pitch) ? 'active' : ''}`}
            onMouseDown={() => handleMouseDown(mapping.pitch)}
            onMouseUp={() => handleMouseUp(mapping.pitch)}
            onMouseLeave={() => {
              if (activeKeys.has(mapping.pitch)) {
                handleMouseUp(mapping.pitch);
              }
            }}
          >
            <span className="key-label">{mapping.label}</span>
            <span className="key-hint">{mapping.key.toUpperCase()}</span>
          </div>
        ))}
        {blackKeys.map((mapping) => {
          const whiteKeyIndex = whiteKeys.findIndex(wk => wk.pitch < mapping.pitch);
          const leftPosition = (whiteKeyIndex + 0.7) * 50;
          
          return (
            <div
              key={mapping.pitch}
              className={`key black-key ${activeKeys.has(mapping.pitch) ? 'active' : ''}`}
              style={{ left: `${leftPosition}px` }}
              onMouseDown={() => handleMouseDown(mapping.pitch)}
              onMouseUp={() => handleMouseUp(mapping.pitch)}
              onMouseLeave={() => {
                if (activeKeys.has(mapping.pitch)) {
                  handleMouseUp(mapping.pitch);
                }
              }}
            >
              <span className="key-hint">{mapping.key.toUpperCase()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Keyboard;
