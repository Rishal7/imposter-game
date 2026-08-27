import { describe, expect, it } from 'vitest';

import { assignRound, determineOutcome, recordRoundInScoreboard, tallyVotes } from './gameEngine';
import type { RandomSource } from './random';
import type { GameSettings, Player, RoundAssignment } from './types';
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

const baseSettings: GameSettings = { imposterSeesCategory: false, imposterGetsHint: false, twoImposters: false };

const players: Player[] = [
  { id: 'p1', name: 'Aiden' },
  { id: 'p2', name: 'Meera' },
  { id: 'p3', name: 'Rohan' },
];

const fivePlayers: Player[] = [
  ...players,
  { id: 'p4', name: 'Divya' },
  { id: 'p5', name: 'Kiran' },
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
      settings: baseSettings,
      wordProvider,
      random,
    });

    const roles = [...round.roles.values()];
    const imposters = roles.filter((role) => role.kind === 'imposter');
    const civilians = roles.filter((role) => role.kind === 'civilian');

    expect(round.imposterIds).toHaveLength(1);
    expect(imposters).toHaveLength(1);
    expect(civilians).toHaveLength(players.length - 1);
    expect(civilians.every((role) => role.kind === 'civilian' && role.word === round.secretWord)).toBe(true);
  });

  it('withholds the category and hint when settings disable them', () => {
    const random = new SequenceRandomSource([0, 0, 0]);
    const round = assignRound({
      players,
      categoryIds: ['food'],
      settings: baseSettings,
      wordProvider,
      random,
    });

    const imposterRole = round.roles.get(round.imposterIds[0]);
    expect(imposterRole).toEqual({ kind: 'imposter', hint: null, category: null, teammateId: null });
  });

  it("gives the imposter that word's authored hint when enabled", () => {
    const random = new SequenceRandomSource([0, 0, 1]);
    const round = assignRound({
      players,
      categoryIds: ['food'],
      settings: { ...baseSettings, imposterSeesCategory: true, imposterGetsHint: true },
      wordProvider,
      random,
    });

    const drawnEntry = wordProvider.getCategories()[0].words.find((entry) => entry.word === round.secretWord);
    const imposterRole = round.roles.get(round.imposterIds[0]);
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
        settings: baseSettings,
        wordProvider,
        random,
      }),
    ).toThrow();
  });

  it('picks two distinct imposters who each know the other when enabled with enough players', () => {
    const random = new SequenceRandomSource([0, 1, 2]);
    const round = assignRound({
      players: fivePlayers,
      categoryIds: ['food'],
      settings: { ...baseSettings, twoImposters: true },
      wordProvider,
      random,
    });

    expect(round.imposterIds).toHaveLength(2);
    const [firstId, secondId] = round.imposterIds;
    expect(firstId).not.toBe(secondId);

    const firstRole = round.roles.get(firstId);
    const secondRole = round.roles.get(secondId);
    expect(firstRole?.kind).toBe('imposter');
    expect(secondRole?.kind).toBe('imposter');
    if (firstRole?.kind === 'imposter' && secondRole?.kind === 'imposter') {
      expect(firstRole.teammateId).toBe(secondId);
      expect(secondRole.teammateId).toBe(firstId);
    }

    const civilianCount = [...round.roles.values()].filter((role) => role.kind === 'civilian').length;
    expect(civilianCount).toBe(fivePlayers.length - 2);
  });

  it('steers away from a recently used word when the category has alternatives', () => {
    const random = new SequenceRandomSource([0, 0, 1]);
    const round = assignRound({
      players,
      categoryIds: ['food'],
      settings: baseSettings,
      wordProvider,
      random,
      excludeWords: new Set(['Pizza']),
    });

    expect(round.secretWord).not.toBe('Pizza');
  });

  it('falls back to repeating a word when every option in the category is excluded', () => {
    const tinyProvider = new StaticWordProvider([{ id: 'mini', name: 'Mini', words: [{ word: 'Only', hint: 'One' }] }]);
    const random = new SequenceRandomSource([0, 0]);
    const round = assignRound({
      players,
      categoryIds: ['mini'],
      settings: baseSettings,
      wordProvider: tinyProvider,
      random,
      excludeWords: new Set(['Only']),
    });

    expect(round.secretWord).toBe('Only');
  });

  it('steers away from a recent imposter when enough other players are eligible', () => {
    const random = new SequenceRandomSource([0, 0, 0]);
    const round = assignRound({
      players,
      categoryIds: ['food'],
      settings: baseSettings,
      wordProvider,
      random,
      excludeImposterIds: new Set(['p3']),
    });

    expect(round.imposterIds).toEqual(['p1']);
  });

  it('falls back to the full roster when every player is on cooldown', () => {
    const random = new SequenceRandomSource([0, 0, 1]);
    const round = assignRound({
      players,
      categoryIds: ['food'],
      settings: baseSettings,
      wordProvider,
      random,
      excludeImposterIds: new Set(['p1', 'p2', 'p3']),
    });

    expect(round.imposterIds).toHaveLength(1);
  });

  it('keeps both two-imposter picks off cooldown when exactly enough players are eligible', () => {
    const random = new SequenceRandomSource([0, 1, 0, 0]);
    const round = assignRound({
      players: fivePlayers,
      categoryIds: ['food'],
      settings: { ...baseSettings, twoImposters: true },
      wordProvider,
      random,
      excludeImposterIds: new Set(['p1', 'p2', 'p3']),
    });

    expect(round.imposterIds).toHaveLength(2);
    expect(round.imposterIds).toEqual(expect.arrayContaining(['p4', 'p5']));
  });

  it('stays at one imposter when twoImposters is enabled but there are too few players', () => {
    const random = new SequenceRandomSource([0, 0, 1]);
    const round = assignRound({
      players,
      categoryIds: ['food'],
      settings: { ...baseSettings, twoImposters: true },
      wordProvider,
      random,
    });

    expect(round.imposterIds).toHaveLength(1);
    const imposterRole = round.roles.get(round.imposterIds[0]);
    expect(imposterRole?.kind).toBe('imposter');
    if (imposterRole?.kind === 'imposter') {
      expect(imposterRole.teammateId).toBeNull();
    }
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
  it('reports the imposter as caught only when the voted-out player is one of the imposters', () => {
    expect(determineOutcome('p3', ['p3']).imposterCaught).toBe(true);
    expect(determineOutcome('p1', ['p3']).imposterCaught).toBe(false);
    expect(determineOutcome(null, ['p3']).imposterCaught).toBe(false);
    expect(determineOutcome('p2', ['p1', 'p2']).imposterCaught).toBe(true);
  });
});

describe('recordRoundInScoreboard', () => {
  const round: RoundAssignment = {
    categoryId: 'food',
    categoryName: 'Food',
    secretWord: 'Pizza',
    imposterIds: ['p3'],
    roles: new Map(),
  };

  it('credits every player a round played, the imposter a catch, and correct voters', () => {
    const outcome = determineOutcome('p3', ['p3']);
    const votes = [
      { voterId: 'p1', targetId: 'p3' },
      { voterId: 'p2', targetId: 'p3' },
      { voterId: 'p3', targetId: 'p1' },
    ];

    const scoreboard = recordRoundInScoreboard(new Map(), players, round, outcome, votes);

    expect(scoreboard.get('p1')).toMatchObject({ roundsPlayed: 1, timesVotedCorrectly: 1 });
    expect(scoreboard.get('p2')).toMatchObject({ roundsPlayed: 1, timesVotedCorrectly: 1 });
    expect(scoreboard.get('p3')).toMatchObject({
      roundsPlayed: 1,
      timesImposter: 1,
      timesCaughtAsImposter: 1,
      timesEscapedAsImposter: 0,
      timesVotedCorrectly: 0,
    });
  });

  it('credits the imposter an escape when not caught, with no incorrect voter getting credit', () => {
    const outcome = determineOutcome('p1', ['p3']);
    const votes = [{ voterId: 'p2', targetId: 'p1' }];

    const scoreboard = recordRoundInScoreboard(new Map(), players, round, outcome, votes);

    expect(scoreboard.get('p3')).toMatchObject({ timesCaughtAsImposter: 0, timesEscapedAsImposter: 1 });
    expect(scoreboard.get('p2')?.timesVotedCorrectly).toBe(0);
  });

  it('accumulates across multiple rounds instead of overwriting', () => {
    const firstOutcome = determineOutcome('p3', ['p3']);
    const afterFirst = recordRoundInScoreboard(new Map(), players, round, firstOutcome, []);

    const secondRound: RoundAssignment = { ...round, imposterIds: ['p1'] };
    const secondOutcome = determineOutcome(null, ['p1']);
    const afterSecond = recordRoundInScoreboard(afterFirst, players, secondRound, secondOutcome, []);

    expect(afterSecond.get('p1')).toMatchObject({ roundsPlayed: 2, timesImposter: 1, timesEscapedAsImposter: 1 });
    expect(afterSecond.get('p3')).toMatchObject({ roundsPlayed: 2, timesImposter: 1, timesCaughtAsImposter: 1 });
  });
});
