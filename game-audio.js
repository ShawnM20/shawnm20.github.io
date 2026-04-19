// Game Audio System - Sound Effects and Music
class GameAudio {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.isMuted = false;
    
    this.init();
  }
  
  init() {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
      this.createSounds();
      this.setupAudioControls();
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  }
  
  createSounds() {
    // Create game sound effects using Web Audio API
    this.sounds = {
      // UI Sounds
      menuSelect: () => this.createTone(440, 0.1, 'sine'),
      menuConfirm: () => this.createTone(660, 0.2, 'square'),
      menuBack: () => this.createTone(330, 0.15, 'sawtooth'),
      
      // Game Sounds
      crystalCollect: () => this.createCrystalSound(),
      crystalSpawn: () => this.createTone(880, 0.3, 'triangle'),
      energyBoost: () => this.createEnergySound(),
      interaction: () => this.createInteractionSound(),
      hover: () => this.createTone(220, 0.05, 'sine'),
      click: () => this.createClickSound(),
      ambient: () => this.createAmbientSound(),
      
      // Movement Sounds
      move: () => this.createMoveSound(),
      jump: () => this.createJumpSound(),
      zoom: () => this.createZoomSound(),
      
      // Game State Sounds
      gameStart: () => this.createGameStartSound(),
      gameOver: () => this.createGameOverSound(),
      objectiveComplete: () => this.createObjectiveSound(),
      
      // Portfolio Sounds
      sectionReveal: () => this.createRevealSound(),
      skillActivate: () => this.createSkillSound(),
      projectHover: () => this.createProjectSound()
    };
  }
  
  createTone(frequency, duration, type = 'sine', volume = null) {
    if (!this.audioContext) return null;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume || this.sfxVolume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
    
    return { oscillator, gainNode };
  }
  
  createCrystalSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create crystal collection sound with harmonics
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq * (1 + index * 0.1), now);
      
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(now + index * 0.05);
      oscillator.stop(now + 0.5 + index * 0.05);
    });
  }
  
  createEnergySound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create energy boost sound with rising pitch
    for (let i = 0; i < 5; i++) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200 + (i * 100), now);
      oscillator.frequency.exponentialRampToValueAtTime(800 + (i * 200), now + 0.3);
      
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(now + i * 0.02);
      oscillator.stop(now + 0.5 + i * 0.02);
    }
  }
  
  createInteractionSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create interaction sound with filtered noise
    const bufferSize = this.audioContext.sampleRate * 0.1;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate filtered noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() - 0.5) * 0.1;
    }
    
    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.Q.setValueAtTime(5, now);
    
    gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start(now);
  }
  
  createClickSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create click sound with attack and decay
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(1000, now);
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }
  
  createAmbientSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create ambient drone sound
    const oscillator1 = this.audioContext.createOscillator();
    const oscillator2 = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(55, now);
    
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(82.5, now);
    
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.2, now);
    
    lfoGain.gain.setValueAtTime(20, now);
    
    // Modulate oscillators with LFO
    lfo.connect(lfoGain);
    oscillator1.frequency.connect(lfoGain.gain);
    oscillator2.frequency.connect(lfoGain.gain);
    
    gainNode.gain.setValueAtTime(this.musicVolume * 0.1, now);
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator1.start(now);
    oscillator2.start(now);
    lfo.start(now);
    
    return { oscillator1, oscillator2, gainNode, lfo };
  }
  
  createMoveSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create subtle movement sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(150, now);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(2, now);
    
    gainNode.gain.setValueAtTime(this.sfxVolume * 0.05, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }
  
  createJumpSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create jump sound with pitch sweep
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.2);
    
    gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }
  
  createZoomSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create zoom sound with white noise
    const bufferSize = this.audioContext.sampleRate * 0.05;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() - 0.5) * 0.05;
    }
    
    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();
    
    source.buffer = buffer;
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, now);
    
    gainNode.gain.setValueAtTime(this.sfxVolume * 0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    source.start(now);
  }
  
  createGameStartSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create game start fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, now);
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, now + index * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8 + index * 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(now + index * 0.1);
      oscillator.stop(now + 0.8 + index * 0.1);
    });
  }
  
  createGameOverSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create game over sound with descending pitch
    const notes = [523.25, 415.30, 329.63, 261.63]; // C5, G#4, E4, C4
    
    notes.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now);
      
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(now + index * 0.2);
      oscillator.stop(now + 1.5 + index * 0.2);
    });
  }
  
  createObjectiveSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create objective complete sound with ascending arpeggio
    const frequencies = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    
    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now);
      
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, now + index * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8 + index * 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(now + index * 0.1);
      oscillator.stop(now + 0.8 + index * 0.1);
    });
  }
  
  createRevealSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create reveal sound with shimmer effect
    for (let i = 0; i < 8; i++) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(800 + (i * 200), now);
      
      gainNode.gain.setValueAtTime(this.sfxVolume * 0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start(now + i * 0.02);
      oscillator.stop(now + 0.5 + i * 0.02);
    }
  }
  
  createSkillSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create skill activation sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(440, now);
    
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.Q.setValueAtTime(10, now);
    
    gainNode.gain.setValueAtTime(this.sfxVolume * 0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }
  
  createProjectSound() {
    if (!this.audioContext) return;
    
    const now = this.audioContext.currentTime;
    
    // Create project hover sound with gentle tone
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, now);
    
    gainNode.gain.setValueAtTime(this.sfxVolume * 0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start(now);
    oscillator.stop(now + 0.2);
  }
  
  playSound(soundName) {
    if (this.sounds[soundName] && !this.isMuted) {
      this.sounds[soundName]();
    }
  }
  
  setupAudioControls() {
    // Setup keyboard shortcuts for audio control
    document.addEventListener('keydown', (e) => {
      if (e.key === 'm' || e.key === 'M') {
        this.toggleMute();
      }
      if (e.key === '=' || e.key === '+') {
        this.adjustVolume(0.1);
      }
      if (e.key === '-' || e.key === '_') {
        this.adjustVolume(-0.1);
      }
    });
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      // Stop all sounds
      if (this.audioContext) {
        this.audioContext.suspend();
      }
    } else {
      // Resume audio context
      if (this.audioContext) {
        this.audioContext.resume();
      }
    }
  }
  
  adjustVolume(delta) {
    this.sfxVolume = Math.max(0, Math.min(1, this.sfxVolume + delta));
    this.musicVolume = Math.max(0, Math.min(1, this.musicVolume + delta));
    
    // Show volume indicator (could add HUD element)
    console.log(`SFX Volume: ${Math.round(this.sfxVolume * 100)}%`);
    console.log(`Music Volume: ${Math.round(this.musicVolume * 100)}%`);
  }
  
  // Resume audio context on user interaction (required by browsers)
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Initialize audio system
let gameAudio;

document.addEventListener('DOMContentLoaded', () => {
  gameAudio = new GameAudio();
  
  // Resume audio on first user interaction
  document.addEventListener('click', () => {
    gameAudio.resumeAudioContext();
  }, { once: true });
  
  document.addEventListener('keydown', () => {
    gameAudio.resumeAudioContext();
  }, { once: true });
});

// Export for use in other scripts
window.GameAudio = GameAudio;
