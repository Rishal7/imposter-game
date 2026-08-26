import { describe, expect, it } from 'vitest';

import { assignRound, determineOutcome, tallyVotes } from './gameEngine';
import type { RandomSource } from './random';
import type { Player } from './types';
import { StaticWordProvider } from './wordProvider';

/** Replays a fixed sequence of `nextInt` results so tests are deterministic. */
class SequenceRandomSource implements RandomSource {
  private cursor = 0;
  private readonly sequence: readonly number[];

  constructor(sequence: readonly number[]) {
    this.sequence = sequence;
  }

  nextInt(max: number): number {
    const value = this.sequence[this.cursor % this.sequence.length] % max;
    this.cursor += 1;
    return value;
  }
}

const players: Player[] = [
  { id: 'p1', name: 'Aiden' },
  { id: 'p2', name: 'Meera' },
  { id: 'p3', name: 'Rohan' },
];

const wordProvider = new StaticWordProvider([
  {
    id: 'food',
    name: 'Food',
    words: [
      { word: 'Pizza', hint: 'Italian' },
      { word: 'Sushi', hint: 'Japanese' },
      { word: 'Tacos', hint: 'Mexican' },
    ],
  },
]);

describe('assignRound', () => {
  it('gives exactly one imposter and the rest the same civilian word', () => {
    const random = new SequenceRandomSource([0, 0, 1]);
    const round = assignRound({
      players,
      categoryIds: ['food'],
      settings: { imposterSeesCategory: false, imposterGetsHint: false },
      wordProvider,
      random,
    });

    const roles = [...round.roles.values()];
    const imposters = roles.filter((role) => role.kind === 'imposter');
    const civilians = roles.filter((role) => role.kind === 'civilian');

    expect(imposters).toHaveLength(1);
    expect(civilians).toHaveLength(players.length - 1);
    expect(civilians.every((role) => role.kind === 'civilian' && role.word === round.secretWord)).toBe(true);
  });

  it('withholds the category and hint when settings disable them', () => {
    const random = new SequenceRandomSource([0, 0, 0]);
    const round = assignRound({
      players,
      categoryIds: ['food'],
      settings: { imposterSeesCategory: false, imposterGetsHint: false },
      wordProvider,
      random,
    });

    const imposterRole = round.roles.get(round.imposterId);
    expect(imposterRole).toEqual({ kind: 'imposter', hint: null, category: null });
  });

  it("gives the imposter that word's authored hint when enabled", () => {
    const random = new SequenceRandomSource([0, 0, 1]);
    const round = assignRound({
      players,
      categoryIds: ['food'],
      settings: { imposterSeesCategory: true, imposterGetsHint: true },
      wordProvider,
      random,
    });

    const drawnEntry = wordProvider.getCategories()[0].words.find((entry) => entry.word === round.secretWord);
    const imposterRole = round.roles.get(round.imposterId);
    expect(imposterRole?.kind).toBe('imposter');
    if (imposterRole?.kind === 'imposter') {
      expect(imposterRole.hint).toBe(drawnEntry?.hint);
      expect(imposterRole.category).toBe('Food');
    }
  });

  it('rejects rounds below the minimum player count', () => {
    const random = new SequenceRandomSource([0]);
    expect(() =>
      assignRound({
        players: players.slice(0, 2),
        categoryIds: ['food'],
        settings: { imposterSeesCategory: false, imposterGetsHint: false },
        wordProvider,
        random,
      }),
    ).toThrow();
  });
});

describe('tallyVotes', () => {
  it('counts votes per target and includes players with zero votes', () => {
    const tally = tallyVotes(players, [
      { voterId: 'p1', targetId: 'p3' },
      { voterId: 'p2', targetId: 'p3' },
    ]);

    expect(tally).toEqual([
      { playerId: 'p3', votes: 2 },
      { playerId: 'p1', votes: 0 },
      { playerId: 'p2', votes: 0 },
    ]);
  });
});

describe('determineOutcome', () => {
  it('reports the imposter as caught only when votes match', () => {
    expect(determineOutcome('p3', 'p3').imposterCaught).toBe(true);
    expect(determineOutcome('p1', 'p3').imposterCaught).toBe(false);
    expect(determineOutcome(null, 'p3').imposterCaught).toBe(false);
  });
});
