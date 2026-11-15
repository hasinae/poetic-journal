// A soft generated pad: slow chords made with the Web Audio API, no audio files.

const CHORDS = [
  [220.0, 261.63, 329.63, 392.0], // A minor 7
  [174.61, 220.0, 261.63, 329.63], // F major 7
  [196.0, 246.94, 293.66, 392.0], // G
  [164.81, 196.0, 246.94, 329.63] // E minor
];
const CHORD_SECONDS = 8;
const VOLUME = 0.06;

let ctx = null;
let master = null;
let timer = null;
let step = 0;
let playing = false;

function playChord() {
  const now = ctx.currentTime;
  for (const freq of CHORDS[step % CHORDS.length]) {
    for (const detune of [-6, 6]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(1, now + 3);
      gain.gain.linearRampToValueAtTime(0, now + CHORD_SECONDS + 3);
      osc.connect(gain).connect(master);
      osc.start(now);
      osc.stop(now + CHORD_SECONDS + 3.1);
    }
  }
  step += 1;
}

export function isAmbientPlaying() {
  return playing;
}

/** Must be called from a click or key press, because browsers block autoplay. */
export function startAmbient() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return false;
  if (!ctx) {
    ctx = new AudioContext();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(filter).connect(ctx.destination);
  }
  ctx.resume();
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(VOLUME, ctx.currentTime, 1.5);
  playChord();
  timer = window.setInterval(playChord, CHORD_SECONDS * 1000);
  playing = true;
  return true;
}

export function stopAmbient() {
  if (!ctx) return;
  window.clearInterval(timer);
  timer = null;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
  playing = false;
}
