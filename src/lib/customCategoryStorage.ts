import type { Category, WordEntry } from '@/domain/types';

const STORAGE_KEY = 'imposter:custom-categories';

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

/** Custom word packs live in localStorage only — no account/sync involved. */
export function loadCustomCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCategory) : [];
  } catch {
    return [];
  }
}

export function saveCustomCategories(categories: readonly Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // Storage full or unavailable (private browsing) — pack just won't persist.
  }
}
