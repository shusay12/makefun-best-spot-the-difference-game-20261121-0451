// All sound is synthesised with WebAudio oscillators: no audio files, no
// network, and nothing to load. Every effect is a short envelope so a find
// feels like a chime, a miss like a soft thud, and a win like a little run.

let audioContext = null;
let muted = false;

function context() {
  if (audioContext === null) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') void audioContext.resume();
  return audioContext;
}

function tone(frequency, startAt, duration, type, volume) {
  const ctx = context();
  if (ctx === null || muted) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, ctx.currentTime + startAt);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(ctx.currentTime + startAt);
  oscillator.stop(ctx.currentTime + startAt + duration + 0.05);
}

export function playFound() {
  tone(880, 0, 0.16, 'sine', 0.16);
  tone(1318.5, 0.07, 0.22, 'sine', 0.14);
}

export function playWrong() {
  tone(196, 0, 0.18, 'triangle', 0.14);
  tone(147, 0.08, 0.22, 'triangle', 0.12);
}

export function playHint() {
  tone(659.3, 0, 0.12, 'sine', 0.1);
  tone(987.8, 0.09, 0.16, 'sine', 0.1);
}

export function playClick() {
  tone(523.3, 0, 0.07, 'sine', 0.07);
}

export function playRoundWin() {
  [523.3, 659.3, 784, 1046.5].forEach((frequency, index) => {
    tone(frequency, index * 0.11, 0.24, 'sine', 0.14);
  });
}

export function playGameWin() {
  [523.3, 659.3, 784, 1046.5, 1318.5, 1568].forEach((frequency, index) => {
    tone(frequency, index * 0.12, 0.3, 'sine', 0.13);
  });
}

export function playRoundLost() {
  tone(392, 0, 0.25, 'triangle', 0.12);
  tone(311.1, 0.18, 0.3, 'triangle', 0.12);
  tone(233.1, 0.36, 0.4, 'triangle', 0.12);
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}
