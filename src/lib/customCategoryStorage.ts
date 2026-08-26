import type { PersistStorage, StorageValue } from 'zustand/middleware';

import type { Category, WordEntry } from '@/domain/types';

export const CUSTOM_CATEGORIES_STORAGE_KEY = 'imposter:custom-categories';

export interface CustomCategoriesSlice {
  customCategories: Category[];
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

/**
 * Custom word packs live in localStorage only — no account/sync involved.
 * Stores the slice as a plain array (not zustand's `{state, version}`
 * envelope) so the on-disk shape stays simple and easy to inspect.
 */
export const customCategoriesStorage: PersistStorage<CustomCategoriesSlice> = {
  getItem: (name): StorageValue<CustomCategoriesSlice> | null => {
    try {
      const raw = localStorage.getItem(name);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      const customCategories = Array.isArray(parsed) ? parsed.filter(isCategory) : [];
      return { state: { customCategories } };
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, JSON.stringify(value.state.customCategories));
    } catch {
      // Storage full or unavailable (private browsing) — pack just won't persist.
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch {
      // Storage unavailable — nothing to clean up.
    }
  },
};
