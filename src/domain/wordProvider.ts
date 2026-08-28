import { pickRandom, type RandomSource } from './random';
import type { Category, WordEntry } from './types';
import { WORD_BANK } from './wordBank.data';

/**
 * Everything the game engine needs from a word source. Any implementation
 * (static bank, remote pack, user-authored deck) can be substituted without
 * changing `gameEngine.ts` — the engine only ever talks to this interface.
 */
export interface WordProvider {
  getCategories(): readonly Category[];
  pickSecretWord(
    categoryIds: readonly string[],
    random: RandomSource,
    excludeWords?: ReadonlySet<string>,
    excludeCategoryIds?: ReadonlySet<string>,
  ): { category: Category; entry: WordEntry };
}

export class StaticWordProvider implements WordProvider {
  private readonly categories: readonly Category[];

  constructor(categories: readonly Category[] = WORD_BANK) {
    this.categories = categories;
  }

  getCategories(): readonly Category[] {
    return this.categories;
  }

  /**
   * `excludeCategoryIds` steers away from the last category drawn, so
   * picking from several packs doesn't streak on one by chance — but only
   * when another selected category is still available. `excludeWords`
   * then does the same for words, but only within the drawn category, and
   * only when that leaves at least one option — a category too small to
   * honor either exclusion just falls back to its full pool rather than
   * throwing.
   */
  pickSecretWord(
    categoryIds: readonly string[],
    random: RandomSource,
    excludeWords: ReadonlySet<string> = new Set(),
    excludeCategoryIds: ReadonlySet<string> = new Set(),
  ): { category: Category; entry: WordEntry } {
    const selectedIds = new Set(categoryIds);
    const pool = this.categories.filter((category) => selectedIds.has(category.id));
    if (pool.length === 0) {
      throw new Error('No categories selected to draw a word from.');
    }
    const freshCategories = pool.filter((category) => !excludeCategoryIds.has(category.id));
    const candidateCategories = freshCategories.length > 0 ? freshCategories : pool;
    const category = pickRandom(candidateCategories, random);
    const freshWords = category.words.filter((entry) => !excludeWords.has(entry.word));
    const candidateWords = freshWords.length > 0 ? freshWords : category.words;
    const entry = pickRandom(candidateWords, random);
    return { category, entry };
  }
}
