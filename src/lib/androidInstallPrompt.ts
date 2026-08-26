import { isStandaloneDisplay } from './pwaDisplay';

const DISMISSED_KEY = 'imposter:android-install-dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function isAndroid(): boolean {
  return /Android/.test(window.navigator.userAgent);
}

/**
 * Chrome fires `beforeinstallprompt` (then withholds its own mini-infobar,
 * via preventDefault) once its own engagement heuristics are satisfied —
 * we capture that moment so our own banner can trigger the native install
 * dialog on demand instead of waiting for the browser's chrome to show it.
 */
export function initAndroidInstallPromptCapture(): void {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    listeners.forEach((listener) => listener());
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    dismissAndroidInstallNudge();
    listeners.forEach((listener) => listener());
  });
}

/** Re-checks nudge eligibility whenever the captured prompt state changes. */
export function onAndroidInstallPromptChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function shouldShowAndroidInstallNudge(): boolean {
  if (isStandaloneDisplay() || !isAndroid() || deferredPrompt === null) return false;
  try {
    return localStorage.getItem(DISMISSED_KEY) !== '1';
  } catch {
    return false;
  }
}

export async function triggerAndroidInstallPrompt(): Promise<void> {
  if (!deferredPrompt) return;
  await deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
}

export function dismissAndroidInstallNudge(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    // Storage unavailable — nudge just reappears next visit, not worth failing over.
  }
}
