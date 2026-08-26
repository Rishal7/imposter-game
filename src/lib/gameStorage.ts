import type { PersistStorage, StorageValue } from 'zustand/middleware';

import type { Category, GameSettings, WordEntry } from '@/domain/types';

/** Identifies this persist instance to zustand — the adapter below ignores it and always reads/writes the two keys beneath. */
export const GAME_PERSIST_NAME = 'imposter:game';

const CUSTOM_CATEGORIES_STORAGE_KEY = 'imposter:custom-categories';
const SETTINGS_STORAGE_KEY = 'imposter:settings';

export const DEFAULT_SETTINGS: GameSettings = {
  imposterSeesCategory: false,
  imposterGetsHint: true,
  twoImposters: false,
};

export interface PersistedGameSlice {
  customCategories: Category[];
  settings: GameSettings;
}

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

/**
 * Custom word packs and rule settings live in localStorage only — no
 * account/sync involved. Each is stored under its own key in the plain
 * shape a reader would expect (an array, a settings object) rather than
 * zustand's `{state, version}` envelope, so the on-disk data stays simple.
 */
export const gameStorage: PersistStorage<PersistedGameSlice> = {
  getItem: (): StorageValue<PersistedGameSlice> => {
    let customCategories: Category[] = [];
    let settings: GameSettings = DEFAULT_SETTINGS;

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

    return { state: { customCategories, settings } };
  },
  setItem: (_name, value) => {
    try {
      localStorage.setItem(CUSTOM_CATEGORIES_STORAGE_KEY, JSON.stringify(value.state.customCategories));
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(value.state.settings));
    } catch {
      // Storage full or unavailable (private browsing) — just won't persist.
    }
  },
  removeItem: () => {
    try {
      localStorage.removeItem(CUSTOM_CATEGORIES_STORAGE_KEY);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch {
      // Storage unavailable — nothing to clean up.
    }
  },
};
