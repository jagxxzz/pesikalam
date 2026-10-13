import { VoicePreset } from '../types';

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'deep_bass',
    name: 'Deep Bass / Godfather',
    tamilTag: 'கம்பீர குரல் (Heavy Bass)',
    category: 'Cinematic',
    icon: '🎙️',
    description: 'Deep authoritative bass resonance with low-end rumble',
    pitch: 0.65,
    distortion: 0.15,
    reverb: 0.35,
    delay: 0.1,
    filterType: 'lowshelf',
    filterFreq: 180,
  },
  {
    id: 'tamil_mass_punch',
    name: 'Tamil Hero Mass Punch',
    tamilTag: 'மாஸ் ஹீரோ பன்ச் (Anirudh Boost)',
    category: 'Cinematic',
    icon: '🔥',
    description: 'Maximum bass punch with dialogue clarity and punchy compression',
    pitch: 0.85,
    distortion: 0.25,
    reverb: 0.45,
    delay: 0.18,
    filterType: 'peaking',
    filterFreq: 280,
  },
  {
    id: 'cinema_voiceover',
    name: 'Cinema Trailer Voice',
    tamilTag: 'டிரெய்லர் வாய்ஸ்',
    category: 'Cinematic',
    icon: '🎬',
    description: 'Epic Hollywood & Kollywood movie trailer baritone presence',
    pitch: 0.72,
    distortion: 0.1,
    reverb: 0.55,
    delay: 0.22,
    filterType: 'lowshelf',
    filterFreq: 220,
  },
  {
    id: 'monster_demon',
    name: 'Monster / Demon',
    tamilTag: 'ராட்சச குரல்',
    category: 'Fun',
    icon: '👹',
    description: 'Terrifying guttural growl with dark sub-harmonics',
    pitch: 0.5,
    distortion: 0.65,
    reverb: 0.5,
    delay: 0.25,
    filterType: 'lowpass',
    filterFreq: 750,
  },
  {
    id: 'chipmunk',
    name: 'Chipmunk / Alvin',
    tamilTag: 'குட்டி அணில் (High Pitch)',
    category: 'Fun',
    icon: '🐿️',
    description: 'Ultra high-pitch squeaky cartoon voice',
    pitch: 1.85,
    distortion: 0.0,
    reverb: 0.1,
    delay: 0.05,
    filterType: 'highpass',
    filterFreq: 650,
  },
  {
    id: 'helium_balloon',
    name: 'Helium Balloon',
    tamilTag: 'ஹீலியம் பலூன் வாய்ஸ்',
    category: 'Fun',
    icon: '🎈',
    description: 'Hilarious helium balloon squeaky tone',
    pitch: 1.6,
    distortion: 0.05,
    reverb: 0.15,
    delay: 0.08,
    filterType: 'peaking',
    filterFreq: 1200,
  },
  {
    id: 'robot_cylon',
    name: 'Robot / Cylon',
    tamilTag: 'ரோபோ குரல் (Mechanical)',
    category: 'Sci-Fi',
    icon: '🤖',
    description: 'Metallic ring-modulated robotic synth voice',
    pitch: 1.0,
    distortion: 0.5,
    reverb: 0.3,
    delay: 0.12,
    filterType: 'bandpass',
    filterFreq: 1100,
  },
  {
    id: 'cyberpunk_synth',
    name: 'Cyberpunk Synth',
    tamilTag: 'சைபர்பங்க் ரோபோ',
    category: 'Sci-Fi',
    icon: '⚡',
    description: 'Futuristic neon vocoder synthesizer effect',
    pitch: 1.15,
    distortion: 0.4,
    reverb: 0.6,
    delay: 0.2,
    filterType: 'peaking',
    filterFreq: 1800,
  },
  {
    id: 'alien_invader',
    name: 'Alien Invader',
    tamilTag: 'ஏலியன் குரல்',
    category: 'Sci-Fi',
    icon: '👽',
    description: 'Eerie extraterrestrial frequency modulation',
    pitch: 1.35,
    distortion: 0.45,
    reverb: 0.7,
    delay: 0.35,
    filterType: 'notch',
    filterFreq: 900,
  },
  {
    id: 'walkie_talkie',
    name: 'Radio Walkie-Talkie',
    tamilTag: 'வாக்கி டாக்கி (Police Radio)',
    category: 'Acoustic',
    icon: '📻',
    description: 'Crackle bandwidth-limited tactical two-way radio',
    pitch: 1.0,
    distortion: 0.35,
    reverb: 0.05,
    delay: 0.05,
    filterType: 'bandpass',
    filterFreq: 1400,
  },
  {
    id: 'vintage_telephone',
    name: 'Telephone Vintage 1950',
    tamilTag: 'பழைய போன் மைக்',
    category: 'Acoustic',
    icon: '☎️',
    description: 'Narrow-band landline receiver crackle texture',
    pitch: 1.05,
    distortion: 0.3,
    reverb: 0.08,
    delay: 0.04,
    filterType: 'bandpass',
    filterFreq: 1600,
  },
  {
    id: 'megaphone',
    name: 'Megaphone / Loudhailer',
    tamilTag: 'மைக் அனவுன்ஸ்',
    category: 'Acoustic',
    icon: '📢',
    description: 'Blaring street protest megaphone distortion',
    pitch: 1.08,
    distortion: 0.55,
    reverb: 0.2,
    delay: 0.15,
    filterType: 'peaking',
    filterFreq: 2200,
  },
  {
    id: 'echo_chamber',
    name: 'Echo Chamber',
    tamilTag: 'எக்கோ சேம்பர்',
    category: 'Acoustic',
    icon: '🌌',
    description: 'Rhythmic slapback multi-tap repeating echoes',
    pitch: 1.0,
    distortion: 0.0,
    reverb: 0.5,
    delay: 0.45,
    filterType: 'allpass',
    filterFreq: 1000,
  },
  {
    id: 'cave_reverb',
    name: 'Deep Cave / Temple Hall',
    tamilTag: 'மலை குகை எக்கோ',
    category: 'Acoustic',
    icon: '⛰️',
    description: 'Massive atmospheric reverberation in stone cavern',
    pitch: 0.95,
    distortion: 0.05,
    reverb: 0.85,
    delay: 0.4,
    filterType: 'lowpass',
    filterFreq: 2400,
  },
  {
    id: 'studio_reverb',
    name: 'Studio Pro Reverb',
    tamilTag: 'ரெக்கார்டிங் ஸ்டுடியோ',
    category: 'Vocal',
    icon: '🎧',
    description: 'Silky smooth golden plate vocal enhancement',
    pitch: 1.0,
    distortion: 0.0,
    reverb: 0.4,
    delay: 0.12,
    filterType: 'peaking',
    filterFreq: 3200,
  },
  {
    id: 'kuthu_mic',
    name: 'Kuthu / Gana Mic',
    tamilTag: 'கானா பாட்டு மைக்',
    category: 'Vocal',
    icon: '🪘',
    description: 'Chennai street festival stage mic with high treble punch',
    pitch: 1.08,
    distortion: 0.2,
    reverb: 0.5,
    delay: 0.22,
    filterType: 'peaking',
    filterFreq: 2800,
  },
  {
    id: 'stadium_announcer',
    name: 'Stadium / Match Announcer',
    tamilTag: 'சேப்பாக்கம் ஸ்டேடியம் மைக்',
    category: 'Acoustic',
    icon: '🏟️',
    description: 'Massive Chepauk cricket stadium PA announcement system',
    pitch: 1.02,
    distortion: 0.15,
    reverb: 0.75,
    delay: 0.38,
    filterType: 'peaking',
    filterFreq: 1900,
  },
  {
    id: 'pop_autotune',
    name: 'Autotune Pop Singer',
    tamilTag: 'ஆட்டோ டியூன் பாப்',
    category: 'Vocal',
    icon: '🎵',
    description: 'Pitch-quantized modern pop auto-tune shimmer',
    pitch: 1.12,
    distortion: 0.1,
    reverb: 0.35,
    delay: 0.15,
    filterType: 'peaking',
    filterFreq: 2600,
  },
  {
    id: 'soft_whisper',
    name: 'Intimate Whisper',
    tamilTag: 'ரகசிய முணுமுணுப்பு',
    category: 'Vocal',
    icon: '🤫',
    description: 'Breath-close ASMR high frequency intimacy',
    pitch: 1.1,
    distortion: 0.0,
    reverb: 0.3,
    delay: 0.08,
    filterType: 'highpass',
    filterFreq: 1200,
  },
  {
    id: 'underwater_submarine',
    name: 'Underwater Submarine',
    tamilTag: 'தண்ணீர் அடியில் (Muffled)',
    category: 'Acoustic',
    icon: '🌊',
    description: 'Submerged watery dampening with bubbles swirl',
    pitch: 0.8,
    distortion: 0.1,
    reverb: 0.6,
    delay: 0.25,
    filterType: 'lowpass',
    filterFreq: 450,
  },
  {
    id: 'retro_8bit',
    name: '8-Bit Retro Arcade',
    tamilTag: 'வீடியோ கேம் வாய்ஸ்',
    category: 'Sci-Fi',
    icon: '👾',
    description: 'Crushed sample-rate retro gaming console voice',
    pitch: 1.25,
    distortion: 0.6,
    reverb: 0.1,
    delay: 0.1,
    filterType: 'bandpass',
    filterFreq: 1500,
  },
  {
    id: 'natural_normal',
    name: 'Natural Voice (Bypass)',
    tamilTag: 'இயற்கை குரல் (Normal)',
    category: 'Vocal',
    icon: '✨',
    description: 'Crystal clear HD voice without any alteration',
    pitch: 1.0,
    distortion: 0.0,
    reverb: 0.0,
    delay: 0.0,
    filterType: 'allpass',
    filterFreq: 1000,
  },
];

// Web Audio DSP Engine for Live Real-Time Voice Transformation
export class VoiceChangerEngine {
  private ctx: AudioContext | null = null;
  private inputNode: MediaStreamAudioSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private delayNode: DelayNode | null = null;
  private feedbackGain: GainNode | null = null;
  private distortionNode: WaveShaperNode | null = null;
  private masterGain: GainNode | null = null;
  private activePreset: VoicePreset = VOICE_PRESETS[0];
  private isProcessing: boolean = false;
  private testOscInterval: any = null;

  constructor() {
    // Lazily init on gesture
  }

  private initContext() {
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

  // Generate distortion curve for WaveShaper
  private makeDistortionCurve(amount: number) {
    const k = typeof amount === 'number' ? amount * 50 : 0;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public async attachMicrophone(stream: MediaStream) {
    try {
      this.initContext();
      if (!this.ctx) return;

      this.inputNode = this.ctx.createMediaStreamSource(stream);
      this.setupGraph();
      this.isProcessing = true;
    } catch (err) {
      console.warn('VoiceChanger mic attach error:', err);
    }
  }

  private setupGraph() {
    if (!this.ctx || !this.inputNode) return;

    // Create DSP nodes
    this.filterNode = this.ctx.createBiquadFilter();
    this.distortionNode = this.ctx.createWaveShaper();
    this.delayNode = this.ctx.createDelay(1.0);
    this.feedbackGain = this.ctx.createGain();
    this.masterGain = this.ctx.createGain();

    this.applyPresetValues(this.activePreset);

    // Wire nodes: input -> filter -> distortion -> delay / feedback -> master -> destination
    this.inputNode.connect(this.filterNode);
    this.filterNode.connect(this.distortionNode);

    // Delay echo loop
    this.distortionNode.connect(this.delayNode);
    this.delayNode.connect(this.feedbackGain);
    this.feedbackGain.connect(this.delayNode);

    // Merge dry + wet to master
    this.distortionNode.connect(this.masterGain);
    this.delayNode.connect(this.masterGain);

    this.masterGain.connect(this.ctx.destination);
  }

  public applyPreset(preset: VoicePreset) {
    this.activePreset = preset;
    this.applyPresetValues(preset);
  }

  private applyPresetValues(preset: VoicePreset) {
    if (!this.ctx) return;

    if (this.filterNode) {
      this.filterNode.type = preset.filterType;
      this.filterNode.frequency.setValueAtTime(preset.filterFreq, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(preset.category === 'Sci-Fi' ? 5 : 1.2, this.ctx.currentTime);
    }

    if (this.distortionNode) {
      this.distortionNode.curve = this.makeDistortionCurve(preset.distortion);
      this.distortionNode.oversample = '4x';
    }

    if (this.delayNode) {
      this.delayNode.delayTime.setValueAtTime(preset.delay, this.ctx.currentTime);
    }

    if (this.feedbackGain) {
      this.feedbackGain.gain.setValueAtTime(preset.reverb * 0.45, this.ctx.currentTime);
    }
  }

  // Play audio test sample so user can instantly preview the transformed voice preset
  public playTestSample(preset: VoicePreset) {
    this.stopTestSample();
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const delay = this.ctx.createDelay(1.0);
      const delayGain = this.ctx.createGain();

      // Base speech fundamental ~220Hz * pitch
      const freq = 220 * preset.pitch;
      osc.type = preset.category === 'Sci-Fi' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.35);

      filter.type = preset.filterType;
      filter.frequency.setValueAtTime(preset.filterFreq, now);

      delay.delayTime.setValueAtTime(preset.delay || 0.1, now);
      delayGain.gain.setValueAtTime(preset.reverb * 0.4, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(delay);
      delay.connect(delayGain);
      delayGain.connect(gain);

      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // ignore
    }
  }

  public stopTestSample() {
    if (this.testOscInterval) {
      clearInterval(this.testOscInterval);
      this.testOscInterval = null;
    }
  }

  public stop() {
    this.stopTestSample();
    if (this.inputNode) {
      this.inputNode.disconnect();
      this.inputNode = null;
    }
    this.isProcessing = false;
  }
}

export const voiceChangerEngine = new VoiceChangerEngine();
