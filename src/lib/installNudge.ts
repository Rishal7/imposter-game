import { isStandaloneDisplay } from './pwaDisplay';

const DISMISSED_KEY = 'imposter:ios-install-dismissed';

/** iOS (including iPadOS 13+, which spoofs a Mac user agent but has touch). */
function isIos(): boolean {
  const nav = window.navigator;
  const isIosUa = /iPad|iPhone|iPod/.test(nav.userAgent);
  const isIpadDesktopMode = nav.platform === 'MacIntel' && nav.maxTouchPoints > 1;
  return isIosUa || isIpadDesktopMode;
}

/**
 * iOS has no native "install this app" prompt (unlike Android's
 * beforeinstallprompt), so the only way users discover Add to Home Screen
 * is a nudge we show ourselves — once, and only in Safari's browser chrome,
 * never once already installed.
 */
export function shouldShowIosInstallNudge(): boolean {
  if (isStandaloneDisplay() || !isIos()) return false;
  try {
    return localStorage.getItem(DISMISSED_KEY) !== '1';
  } catch {
    return false;
  }
}

export function dismissIosInstallNudge(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, '1');
  } catch {
    // Storage unavailable — nudge just reappears next visit, not worth failing over.
  }
}
