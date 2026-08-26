/** True when launched as an installed app (home-screen PWA), not a browser tab. */
export function isStandaloneDisplay(): boolean {
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone;
  return window.matchMedia('(display-mode: standalone)').matches || iosStandalone === true;
}

/**
 * Pinch-to-zoom is disabled only in standalone mode — in a regular browser
 * tab the user still has normal page zoom. Adds a class the stylesheet uses
 * for `touch-action`, plus a Safari-only gesture-event guard since iOS
 * ignores `touch-action` for the pinch gesture itself.
 */
export function disablePinchZoomInStandalone(): void {
  if (!isStandaloneDisplay()) return;

  document.documentElement.classList.add('standalone-pwa');

  const preventGesture = (event: Event) => event.preventDefault();
  document.addEventListener('gesturestart', preventGesture);
  document.addEventListener('gesturechange', preventGesture);
}
