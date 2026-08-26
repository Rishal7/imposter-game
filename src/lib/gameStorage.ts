import type { PersistStorage, StorageValue } from 'zustand/middleware';

import type { Category, GameSettings, Player, WordEntry } from '@/domain/types';

/** Identifies this persist instance to zustand — the adapter below ignores it and always reads/writes the keys beneath. */
export const GAME_PERSIST_NAME = 'imposter:game';

const CUSTOM_CATEGORIES_STORAGE_KEY = 'imposter:custom-categories';
const SETTINGS_STORAGE_KEY = 'imposter:settings';
const PLAYERS_STORAGE_KEY = 'imposter:players';

export const DEFAULT_SETTINGS: GameSettings = {
  imposterSeesCategory: false,
  imposterGetsHint: true,
  twoImposters: false,
};

export interface PersistedGameSlice {
  customCategories: Category[];
  settings: GameSettings;
  players: Player[];
}

/** `players` is only included by `getItem` once a roster has actually been saved — see below. */
type PersistedGameState = Omit<PersistedGameSlice, 'players'> & Partial<Pick<PersistedGameSlice, 'players'>>;

function isWordEntry(value: unknown): value is WordEntry {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.word === 'string' && typeof record.hint === 'string';
}

function isCategory(value: unknown): value is Category {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    Array.isArray(record.words) &&
    record.words.every(isWordEntry)
  );
}

function isGameSettings(value: unknown): value is GameSettings {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.imposterSeesCategory === 'boolean' &&
    typeof record.imposterGetsHint === 'boolean' &&
    typeof record.twoImposters === 'boolean'
  );
}

function isPlayer(value: unknown): value is Player {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && typeof record.name === 'string';
}

/**
 * Custom word packs, rule settings, and the player roster live in
 * localStorage only — no account/sync involved. Each is stored under its
 * own key in the plain shape a reader would expect (an array, a settings
 * object) rather than zustand's `{state, version}` envelope, so the on-disk
 * data stays simple.
 */
export const gameStorage: PersistStorage<PersistedGameState> = {
  getItem: (): StorageValue<PersistedGameState> => {
    let customCategories: Category[] = [];
    let settings: GameSettings = DEFAULT_SETTINGS;
    let players: Player[] | undefined;

    try {
      const rawCategories = localStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      const parsedCategories: unknown = rawCategories ? JSON.parse(rawCategories) : [];
      customCategories = Array.isArray(parsedCategories) ? parsedCategories.filter(isCategory) : [];
    } catch {
      // Corrupt or unavailable — fall back to no custom categories.
    }

    try {
      const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      const parsedSettings: unknown = rawSettings ? JSON.parse(rawSettings) : null;
      if (isGameSettings(parsedSettings)) settings = parsedSettings;
    } catch {
      // Corrupt or unavailable — fall back to default settings.
    }

    try {
      // No key yet (first-ever visit) leaves `players` undefined so the
      // store keeps its freshly-created default roster instead of being
      // merged down to an empty array.
      const rawPlayers = localStorage.getItem(PLAYERS_STORAGE_KEY);
      if (rawPlayers) {
        const parsedPlayers: unknown = JSON.parse(rawPlayers);
        players = Array.isArray(parsedPlayers) ? parsedPlayers.filter(isPlayer) : undefined;
      }
    } catch {
      // Corrupt or unavailable — fall back to the default roster.
    }

    return { state: { customCategories, settings, ...(players ? { players } : {}) } };
  },
  setItem: (_name, value) => {
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(value.state.customCategories));
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(value.state.settings));
      if (value.state.players) {
        localStorage.setItem(PLAYERS_STORAGE_KEY, JSON.stringify(value.state.players));
      }
    } catch {
      // Storage full or unavailable (private browsing) — just won't persist.
    }
  },
  removeItem: () => {
    try {
      localStorage.removeItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      localStorage.removeItem(PLAYERS_STORAGE_KEY);
    } catch {
      // Storage unavailable — nothing to clean up.
    }
  },
};
