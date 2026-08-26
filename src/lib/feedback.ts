/**
 * Short haptic + tone feedback for key game moments. Vibration is a no-op on
 * platforms without `navigator.vibrate` (desktop, iOS Safari) — nothing to
 * gate manually. Tones are synthesized via Web Audio so no audio assets are
 * shipped.
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  audioContext ??= new Ctor();
  return audioContext;
}

function playTone(frequency: number, durationMs: number): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.16, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + durationMs / 1000);
}

function vibrate(pattern: number | number[]): void {
  navigator.vibrate?.(pattern);
}

/** Peeking at your own word or role. */
export function notifyPeek(): void {
  vibrate(12);
  playTone(720, 70);
}

/** Casting a vote or confirming a honor-system outcome. */
export function notifyVote(): void {
  vibrate(18);
  playTone(540, 90);
}

/** The result reveal — the biggest moment of the round. */
export function notifyReveal(): void {
  vibrate([16, 40, 16]);
  playTone(880, 140);
}
