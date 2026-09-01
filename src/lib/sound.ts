/* Tiny original WebAudio synth — no copyrighted assets. */
let ctx: AudioContext | null = null;
let enabled = false;

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  if (on) ensureCtx();
}

export type BlipKind = 'click' | 'power' | 'portal' | 'error' | 'unlock' | 'page';

export function blip(kind: BlipKind = 'click') {
  if (!enabled) return;
  const ac = ensureCtx();
  if (!ac) return;
  const t0 = ac.currentTime;

  const mk = (type: OscillatorType, freq: number, t: number, dur: number, gainV: number, endFreq?: number) => {
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (endFreq) o.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 1), t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gainV, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ac.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  };

  switch (kind) {
    case 'click': mk('square', 660, t0, 0.07, 0.05, 220); break;
    case 'power': mk('sawtooth', 110, t0, 0.4, 0.08, 620); mk('sine', 55, t0, 0.5, 0.1, 220); break;
    case 'portal': mk('sine', 900, t0, 0.7, 0.06, 120); mk('triangle', 450, t0 + 0.08, 0.6, 0.05, 90); break;
    case 'error': mk('square', 180, t0, 0.12, 0.07); mk('square', 150, t0 + 0.14, 0.18, 0.07); break;
    case 'unlock': mk('triangle', 523, t0, 0.14, 0.07); mk('triangle', 659, t0 + 0.12, 0.14, 0.07); mk('triangle', 784, t0 + 0.24, 0.3, 0.08); break;
    case 'page': mk('sine', 300, t0, 0.18, 0.05, 800); break;
  }
}
