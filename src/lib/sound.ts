let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

function unlock() {
  const c = getCtx();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
}

if (typeof window !== 'undefined') {
  const onFirstGesture = () => {
    unlock();
    window.removeEventListener('pointerdown', onFirstGesture);
    window.removeEventListener('keydown', onFirstGesture);
  };
  window.addEventListener('pointerdown', onFirstGesture, { once: true });
  window.addEventListener('keydown', onFirstGesture, { once: true });
}

function tone(c: AudioContext, freq: number, start: number, duration: number, volume: number, type: OscillatorType = 'sine') {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = c.currentTime + start;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** Two-tone "tun-tun" chime, like a new-ride alert on Uber/Rapido. */
export function playTunTun(repeat = 2) {
  const c = getCtx();
  if (!c) return;
  try {
    unlock();
    let t = 0;
    for (let i = 0; i < repeat; i++) {
      tone(c, 880, t, 0.16, 0.35);
      tone(c, 659, t + 0.18, 0.22, 0.3);
      t += 0.5;
    }
  } catch {
    // ignore audio failures (autoplay blocked, no audio device, etc.)
  }
}
