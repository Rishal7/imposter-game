import type { Category } from './types';

/**
 * Built-in word bank. Kept as plain data so it can be swapped, extended, or
 * loaded from a remote source later by writing a new `WordProvider` —
 * nothing in the game engine depends on this shape directly.
 */
export const WORD_BANK: readonly Category[] = [
  {
    id: 'malayalam-mix',
    name: 'Malayalam Mix',
    words: [
      { word: 'Oscar', hint: 'movies' },
      { word: 'Nivin', hint: 'Beard' },
      { word: 'Iphone', hint: 'Gadget' },
      { word: 'Parivar', hint: 'Hangout' },
      { word: 'Kakkodi', hint: 'City' },
      { word: 'AJP', hint: 'Celebrity' },
      { word: 'Hanan Shah', hint: 'Playback' },
      { word: 'Xylem', hint: 'Institute' },
      { word: 'Netflix', hint: 'Chill' },
      { word: 'Lokesh Kanagaraj', hint: 'Tamil' },
      { word: 'Naslen', hint: 'Youth' },
      { word: 'Instagram', hint: 'Fomo' },
      { word: 'Earphone', hint: 'Ear' },
      { word: 'Innova', hint: 'Travel' },
      { word: 'Japan', hint: 'Destination' },
      { word: 'Valli', hint: 'Kurukk' },
      { word: 'Scene Contra', hint: 'Trouble' },
      { word: 'Maggi', hint: 'Food' },
      { word: 'Friends', hint: 'Relations' },
      { word: 'Iron Box', hint: 'Thenju' },
      { word: 'BoChe', hint: 'Udaayip' },
    ],
  },
];
