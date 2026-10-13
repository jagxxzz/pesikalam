// Gentle web audio effects for micro-interactions & calling simulation
class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private currentPreviewTimer: any = null;
  private currentPreviewOscillators: OscillatorNode[] = [];
  private ringToneInterval: any = null;

  constructor() {
    // Lazily init AudioContext upon user gesture
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleSound(val?: boolean) {
    this.soundEnabled = val !== undefined ? val : !this.soundEnabled;
    return this.soundEnabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // AudioContext may be blocked before interaction
    }
  }

  public playLike() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, this.ctx.currentTime + 0.06); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.14); // G5

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.19);
    } catch {
      // ignore
    }
  }

  public playMessageSent() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }

  public playMessageReceived() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(now + 0.15);
    } catch {
      // ignore
    }
  }

  // Realistic phone ring tone (repeating ringback tone)
  public startRingTone() {
    if (!this.soundEnabled) return;
    this.stopRingTone();

    const ring = () => {
      try {
        this.initCtx();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Standard ring frequencies 440Hz + 480Hz
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, now);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.setValueAtTime(0.08, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.4);
        osc2.stop(now + 1.4);
      } catch {
        // ignore
      }
    };

    ring();
    this.ringToneInterval = setInterval(ring, 3000);
  }

  public stopRingTone() {
    if (this.ringToneInterval) {
      clearInterval(this.ringToneInterval);
      this.ringToneInterval = null;
    }
  }

  // Call Connected Beep
  public playCallConnected() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.1); // A5

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // ignore
    }
  }

  // Call End / Hangup tone
  public playHangupTone() {
    this.stopRingTone();
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.setValueAtTime(320, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // ignore
    }
  }

  // Musical preview playback using synthesized melodic arpeggio loops
  public playMusicPreview(category: string, onStop?: () => void) {
    this.stopMusicPreview();
    if (!this.soundEnabled) return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      // Define musical scales for genres
      let freqs = [329.63, 392.0, 493.88, 587.33, 659.25]; // Default
      let tempo = 220; // ms
      let type: OscillatorType = 'triangle';

      if (category.includes('Mass') || category.includes('Fast')) {
        // Fast energetic minor beat (Hukum, Naa Ready vibe)
        freqs = [220, 261.63, 293.66, 329.63, 440, 523.25];
        tempo = 140;
        type = 'sawtooth';
      } else if (category.includes('Love') || category.includes('Romance')) {
        // Soft romantic pentatonic (Vaseegara, Munbe Vaa vibe)
        freqs = [261.63, 329.63, 392.0, 440, 523.25, 659.25];
        tempo = 260;
        type = 'sine';
      } else if (category.includes('Emotional') || category.includes('Melancholy')) {
        // Melodic melancholy (Oru Naalil, Kanave Kanave vibe)
        freqs = [220, 246.94, 261.63, 329.63, 349.23, 440];
        tempo = 320;
        type = 'sine';
      } else if (category.includes('Devotional') || category.includes('Traditional')) {
        // Traditional ragam mood (Kanda Sashti, Margazhi vibe)
        freqs = [293.66, 329.63, 369.99, 440, 493.88, 587.33];
        tempo = 200;
        type = 'triangle';
      } else if (category.includes('Motivation') || category.includes('Uplifting')) {
        // Victorious major triumph (Survivor, Vetri Kodi Kattu)
        freqs = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
        tempo = 180;
        type = 'triangle';
      }

      let step = 0;
      const playStep = () => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const freq = freqs[step % freqs.length];
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (tempo / 1000) * 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + (tempo / 1000));
        this.currentPreviewOscillators.push(osc);

        step++;
      };

      this.currentPreviewTimer = setInterval(playStep, tempo);
      playStep();

      // Automatically timeout after 15 seconds
      setTimeout(() => {
        this.stopMusicPreview();
        if (onStop) onStop();
      }, 15000);
    } catch {
      // ignore
    }
  }

  public stopMusicPreview() {
    if (this.currentPreviewTimer) {
      clearInterval(this.currentPreviewTimer);
      this.currentPreviewTimer = null;
    }
    this.currentPreviewOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.currentPreviewOscillators = [];
  }
}

export const sounds = new SoundManager();
