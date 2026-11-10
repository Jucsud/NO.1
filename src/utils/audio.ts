/**
 * Procedural Web Audio API Sound Engine
 * Provides rich, zero-404 luxury soundscapes and sound effects:
 * - Ambient cinematic piano and warm celestial drone
 * - Candle blowing whoosh and celestial chime
 * - Gift box unlocking and golden shimmer
 * - Celebration fanfare and sparkle pops
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isAmbientPlaying: boolean = false;
  private ambientGain: GainNode | null = null;
  private ambientInterval: number | null = null;
  private masterGain: GainNode | null = null;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.6, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.6, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isMusicPlaying(): boolean {
    return this.isAmbientPlaying && !this.isMuted;
  }

  public toggleMusic(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  /**
   * Start procedural warm cinematic ambient music
   */
  public startAmbient(): void {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    if (this.isAmbientPlaying) return;
    this.isAmbientPlaying = true;

    // Create ambient bus
    this.ambientGain = ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0, ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 2.5);
    this.ambientGain.connect(this.masterGain);

    // Warm deep drone oscillators (C minor / Eb / G golden chord)
    const baseFreqs = [130.81, 164.81, 196.0, 261.63]; // C3, Eb3, G3, C4
    baseFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // subtle detune for rich analog luxury warmth
      osc.detune.setValueAtTime((idx - 1.5) * 4, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      oscGain.gain.setValueAtTime(0.06 / baseFreqs.length, ctx.currentTime);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.ambientGain!);

      osc.start();
    });

    // Pentatonic celestial piano bell sequence
    const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25]; // C, D, E, G, A
    let noteIndex = 0;

    const scheduleNextBell = () => {
      if (!this.isAmbientPlaying || !this.ctx || !this.ambientGain) return;

      const now = this.ctx.currentTime;
      const freq = notes[noteIndex % notes.length];
      noteIndex = (noteIndex + Math.floor(Math.random() * 3) + 1) % notes.length;

      const osc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      bellGain.gain.setValueAtTime(0.0001, now);
      bellGain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(bellGain);
      bellGain.connect(this.ambientGain);

      osc.start(now);
      osc.stop(now + 2.3);

      const nextDelay = 1400 + Math.random() * 2200;
      this.ambientInterval = window.setTimeout(scheduleNextBell, nextDelay);
    };

    scheduleNextBell();
  }

  public stopAmbient(): void {
    if (!this.isAmbientPlaying) return;
    this.isAmbientPlaying = false;

    if (this.ambientInterval) {
      clearTimeout(this.ambientInterval);
      this.ambientInterval = null;
    }

    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
    }
  }

  /**
   * Sound effect: Subtle luxury button hover
   */
  public playHover(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1050, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  /**
   * Sound effect: Soft crystal button click
   */
  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.09);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  /**
   * Sound effect: Gift box opening with golden shimmer
   */
  public playGiftOpen(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    // Rich ascending chime arpeggio
    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    arpeggio.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime + i * 0.09;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 1.3);
    });
  }

  /**
   * Sound effect: Candle blowing whoosh + star sparkle
   */
  public playCandleBlow(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    // Breath whoosh using filtered noise buffer
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(250, ctx.currentTime + 0.5);
    filter.Q.setValueAtTime(2.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    noise.stop(ctx.currentTime + 0.6);

    // Followed by twinkling star chime
    setTimeout(() => {
      this.playSparkle();
    }, 450);
  }

  /**
   * Sound effect: Golden celebration burst / Confetti
   */
  public playCelebration(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    // Royal celebratory chord progression
    const chords = [
      [523.25, 659.25, 783.99, 1046.5], // C Major
      [587.33, 739.99, 880.0, 1174.66], // D Major
      [659.25, 830.61, 987.77, 1318.51], // E Major
    ];

    chords.forEach((chord, step) => {
      const stepTime = ctx.currentTime + step * 0.22;
      chord.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, stepTime);

        gain.gain.setValueAtTime(0.001, stepTime);
        gain.gain.linearRampToValueAtTime(0.07, stepTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, stepTime + 1.4);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(stepTime);
        osc.stop(stepTime + 1.5);
      });
    });
  }

  /**
   * Sound effect: Celestial sparkle chime
   */
  public playSparkle(): void {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    const pitches = [1318.51, 1567.98, 1760.0, 2093.0, 2637.02];
    pitches.forEach((p, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 0.95);
    });
  }
}

export const soundEngine = new SoundEngine();
