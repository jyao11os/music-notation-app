import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { NotationData, NotationType } from '../types/music';
import { INSTRUMENTS } from '../types/music';
import './Controls.css';

interface ControlsProps {
  notationData: NotationData;
  notationType: NotationType;
  isRecording: boolean;
  isPlaying: boolean;
  onNotationTypeChange: (type: NotationType) => void;
  onTempoChange: (tempo: number) => void;
  onInstrumentChange: (instrument: string) => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRecord: () => void;
  onClear: () => void;
  onSaveMidi: () => void;
  onExportPdf: () => void;
  onLanguageChange: (lang: string) => void;
}

const Controls: React.FC<ControlsProps> = ({
  notationData,
  notationType,
  isRecording,
  isPlaying,
  onNotationTypeChange,
  onTempoChange,
  onInstrumentChange,
  onPlay,
  onPause,
  onStop,
  onRecord,
  onClear,
  onSaveMidi,
  onExportPdf,
  onLanguageChange,
}) => {
  const { t, i18n } = useTranslation();
  const [tempo, setTempo] = useState(notationData.tempo);

  const handleTempoChange = (value: number) => {
    setTempo(value);
    onTempoChange(value);
  };

  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
    onLanguageChange(newLang);
  };

  return (
    <div className="controls-container">
      <div className="controls-section">
        <h3 className="section-title">{t('controls')}</h3>
        
        <div className="control-group">
          <label className="control-label">{t('notation')}</label>
          <div className="button-group">
            <button
              className={`btn ${notationType === 'staff' ? 'btn-active' : 'btn-secondary'}`}
              onClick={() => onNotationTypeChange('staff')}
            >
              {t('staff')}
            </button>
            <button
              className={`btn ${notationType === 'jianpu' ? 'btn-active' : 'btn-secondary'}`}
              onClick={() => onNotationTypeChange('jianpu')}
            >
              {t('jianpu')}
            </button>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">{t('tempo')}: {tempo} {t('bpm')}</label>
          <input
            type="range"
            min="40"
            max="240"
            value={tempo}
            onChange={(e) => handleTempoChange(Number(e.target.value))}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label className="control-label">{t('instrument')}</label>
          <select
            value={notationData.instrument}
            onChange={(e) => onInstrumentChange(e.target.value)}
            className="select"
          >
            {INSTRUMENTS.map((inst) => (
              <option key={inst.value} value={inst.value}>
                {t(inst.value)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">{t('language')}</label>
          <button
            className="btn btn-secondary"
            onClick={handleLanguageToggle}
          >
            {i18n.language === 'en' ? t('chinese') : t('english')}
          </button>
        </div>
      </div>

      <div className="controls-section">
        <h3 className="section-title">
          {isRecording ? t('recording') : t('notRecording')}
        </h3>
        
        <div className="button-grid">
          <button
            className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`}
            onClick={onRecord}
          >
            {t('record')}
          </button>
          
          <button
            className="btn btn-primary"
            onClick={isPlaying ? onPause : onPlay}
            disabled={notationData.notes.length === 0}
          >
            {isPlaying ? t('pause') : t('play')}
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={onStop}
            disabled={!isPlaying}
          >
            {t('stop')}
          </button>
          
          <button
            className="btn btn-danger"
            onClick={onClear}
            disabled={notationData.notes.length === 0}
          >
            {t('clear')}
          </button>
        </div>

        <div className="button-grid">
          <button
            className="btn btn-secondary"
            onClick={onSaveMidi}
            disabled={notationData.notes.length === 0}
          >
            {t('saveMidi')}
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={onExportPdf}
            disabled={notationData.notes.length === 0}
          >
            {t('exportPdf')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
