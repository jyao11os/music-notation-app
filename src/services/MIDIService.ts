import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import type { NotationData } from "../types/music";

class MIDIService {
  private synth: Tone.PolySynth | null = null;
  private currentPart: Tone.Part | null = null;
  private isInitialized = false;
  private currentInstrument: string = 'piano';

  async initialize() {
    if (this.isInitialized) return;
    
    await Tone.start();
    this.updateInstrument('piano');
    this.isInitialized = true;
  }

  updateInstrument(instrument: string) {
    if (this.synth) {
      this.synth.dispose();
    }

    this.currentInstrument = instrument;
    
    // Simple synthesis mapping for different instruments
    let settings: any = {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1 }
    };

    switch (instrument) {
      case 'piano':
        settings = {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 1.2 }
        };
        break;
      case 'guitar':
        settings = {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.05, decay: 0.3, sustain: 0.1, release: 0.8 }
        };
        break;
      case 'violin':
        settings = {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.2, decay: 0.1, sustain: 0.8, release: 0.5 }
        };
        break;
      case 'flute':
        settings = {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.3 }
        };
        break;
      case 'trumpet':
        settings = {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.2 }
        };
        break;
      case 'clarinet':
        settings = {
          oscillator: { type: 'square' },
          envelope: { attack: 0.08, decay: 0.1, sustain: 0.5, release: 0.4 }
        };
        break;
      case 'saxophone':
        settings = {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.3 }
        };
        break;
      case 'cello':
        settings = {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.3, decay: 0.2, sustain: 0.9, release: 0.8 }
        };
        break;
    }

    this.synth = new Tone.PolySynth(Tone.Synth, settings).toDestination();
  }

  async playNote(pitch: number, velocity: number = 80) {
    if (!this.isInitialized) await this.initialize();
    
    const frequency = Tone.Frequency(pitch, 'midi').toFrequency();
    const velocityNormalized = velocity / 127;
    this.synth?.triggerAttack(frequency, Tone.now(), velocityNormalized);
  }

  async stopNote(pitch: number) {
    if (!this.isInitialized) await this.initialize();
    
    const frequency = Tone.Frequency(pitch, 'midi').toFrequency();
    this.synth?.triggerRelease(frequency, Tone.now());
  }

  async playSequence(notationData: NotationData) {
    if (!this.isInitialized) await this.initialize();
    
    // Ensure correct instrument is used
    if (this.currentInstrument !== notationData.instrument) {
      this.updateInstrument(notationData.instrument);
    }

    this.stopSequence();
    Tone.getTransport().bpm.value = notationData.tempo;
    
    const events = notationData.notes.map(note => ({
      time: note.startTime,
      note: note.pitch,
      duration: note.duration,
      velocity: note.velocity || 80,
    }));
    
    this.currentPart = new Tone.Part((time, event) => {
      const frequency = Tone.Frequency(event.note, 'midi').toFrequency();
      const velocityNormalized = event.velocity / 127;
      this.synth?.triggerAttackRelease(
        frequency,
        event.duration,
        time,
        velocityNormalized
      );
    }, events);
    
    this.currentPart.start(0);
    Tone.getTransport().start();
  }

  pauseSequence() {
    Tone.getTransport().pause();
  }

  stopSequence() {
    Tone.getTransport().stop();
    if (this.currentPart) {
      this.currentPart.dispose();
      this.currentPart = null;
    }
  }

  exportToMIDI(notationData: NotationData): Uint8Array {
    const midi = new Midi();
    const track = midi.addTrack();
    midi.header.tempos.push({ bpm: notationData.tempo, ticks: 0 });
    
    notationData.notes.forEach(note => {
      track.addNote({
        midi: note.pitch,
        time: note.startTime,
        duration: note.duration,
        velocity: (note.velocity || 80) / 127,
      });
    });
    
    return midi.toArray();
  }

  downloadMIDI(notationData: NotationData, filename: string = 'composition.mid') {
    const midiData = this.exportToMIDI(notationData);
    const blob = new Blob([new Uint8Array(midiData)], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(url);
  }

  dispose() {
    this.stopSequence();
    if (this.synth) {
      this.synth.dispose();
      this.synth = null;
    }
    this.isInitialized = false;
  }
}

export default new MIDIService();
