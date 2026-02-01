import * as Tone from 'tone';
import { Midi } from '@tonejs/midi';
import { Note, NotationData } from '../types/music';

class MIDIService {
  private synth: Tone.PolySynth | null = null;
  private currentPart: Tone.Part | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    await Tone.start();
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.synth.set({
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.3,
        release: 1,
      },
    });
    this.isInitialized = true;
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
    
    // Stop any currently playing sequence
    this.stopSequence();
    
    // Set tempo
    Tone.getTransport().bpm.value = notationData.tempo;
    
    // Create a part with all notes
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
    
    // Set tempo
    track.addTempo(0, notationData.tempo);
    
    // Add notes
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
    const blob = new Blob([midiData], { type: 'audio/midi' });
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
