const SEEN_KEY = 'imposter:seen-how-to-play';

/** Whether the rules modal has already auto-shown once on this device. */
export function hasSeenHowToPlay(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return true;
  }
}

export function markHowToPlaySeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage unavailable — modal just auto-shows again next visit.
  }
}
