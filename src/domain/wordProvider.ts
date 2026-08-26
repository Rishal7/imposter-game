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
  pickSecretWord(categoryIds: readonly string[], random: RandomSource): { category: Category; entry: WordEntry };
}

export class StaticWordProvider implements WordProvider {
  private readonly categories: readonly Category[];

  constructor(categories: readonly Category[] = WORD_BANK) {
    this.categories = categories;
  }

  getCategories(): readonly Category[] {
    return this.categories;
  }

  pickSecretWord(categoryIds: readonly string[], random: RandomSource): { category: Category; entry: WordEntry } {
    const selectedIds = new Set(categoryIds);
    const pool = this.categories.filter((category) => selectedIds.has(category.id));
    if (pool.length === 0) {
      throw new Error('No categories selected to draw a word from.');
    }
    const category = pickRandom(pool, random);
    const entry = pickRandom(category.words, random);
    return { category, entry };
  }
}
