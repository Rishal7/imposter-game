/**
 * Abstraction over randomness so the game engine never calls `Math.random`
 * directly. This is what makes role assignment deterministic and testable,
 * and leaves room for a seeded source later without touching engine code.
 */
export interface RandomSource {
  /** Returns an integer in the range [0, max). */
  nextInt(max: number): number;
}

export class MathRandomSource implements RandomSource {
  nextInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}

export function pickRandom<T>(items: readonly T[], random: RandomSource): T {
  if (items.length === 0) {
    throw new Error('Cannot pick from an empty list.');
  }
  return items[random.nextInt(items.length)];
}
