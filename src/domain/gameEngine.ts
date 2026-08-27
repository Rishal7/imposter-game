import type { RandomSource } from './random';
import { pickDistinct } from './random';
import type { GameSettings, Player, PlayerRole, RoundAssignment, RoundOutcome, VoteTally } from './types';
import type { WordProvider } from './wordProvider';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
/** Below this player count, a round always runs with a single imposter. */
export const MIN_PLAYERS_FOR_TWO_IMPOSTERS = 5;

export interface AssignRoundParams {
  readonly players: readonly Player[];
  readonly categoryIds: readonly string[];
  readonly settings: GameSettings;
  readonly wordProvider: WordProvider;
  readonly random: RandomSource;
  /** Secret words to steer away from repeating — e.g. the last round or two. */
  readonly excludeWords?: ReadonlySet<string>;
}

/**
 * Draws a secret word and picks the imposter(s) for one round. Pure
 * function: every dependency (word source, randomness) is passed in, so
 * the same inputs always produce a reproducible shape and the logic can
 * be unit tested without mocking modules.
 */
export function assignRound(params: AssignRoundParams): RoundAssignment {
  const { players, categoryIds, settings, wordProvider, random, excludeWords } = params;

  if (players.length < MIN_PLAYERS) {
    throw new Error(`A round needs at least ${MIN_PLAYERS} players.`);
  }

  const { category, entry } = wordProvider.pickSecretWord(categoryIds, random, excludeWords);
  const word = entry.word;
  const hintWord = settings.imposterGetsHint ? entry.hint : null;
  const categoryForImposter = settings.imposterSeesCategory ? category.name : null;

  const imposterCount = settings.twoImposters && players.length >= MIN_PLAYERS_FOR_TWO_IMPOSTERS ? 2 : 1;
  const imposters = pickDistinct(players, imposterCount, random);
  const imposterIds = imposters.map((player) => player.id);

  const roles = new Map<string, PlayerRole>(
    players.map((player): [string, PlayerRole] => {
      if (imposterIds.includes(player.id)) {
        const teammateId = imposterIds.find((id) => id !== player.id) ?? null;
        return [
          player.id,
          { kind: 'imposter', hint: hintWord, category: categoryForImposter, teammateId },
        ];
      }
      return [player.id, { kind: 'civilian', word }];
    }),
  );

  return {
    categoryId: category.id,
    categoryName: category.name,
    secretWord: word,
    imposterIds,
    roles,
  };
}

export interface Vote {
  readonly voterId: string;
  readonly targetId: string;
}

/** Counts votes per target, sorted from most to least voted. */
export function tallyVotes(players: readonly Player[], votes: readonly Vote[]): VoteTally[] {
  const counts = new Map<string, number>(players.map((player) => [player.id, 0]));

  for (const vote of votes) {
    counts.set(vote.targetId, (counts.get(vote.targetId) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([playerId, count]) => ({ playerId, votes: count }))
    .sort((a, b) => b.votes - a.votes);
}

export function determineOutcome(votedOutId: string | null, imposterIds: readonly string[]): RoundOutcome {
  return {
    votedOutId,
    imposterIds,
    imposterCaught: votedOutId !== null && imposterIds.includes(votedOutId),
  };
}

export interface PlayerScore {
  readonly playerId: string;
  readonly roundsPlayed: number;
  readonly timesImposter: number;
  readonly timesCaughtAsImposter: number;
  readonly timesEscapedAsImposter: number;
  readonly timesVotedCorrectly: number;
}

export type Scoreboard = ReadonlyMap<string, PlayerScore>;

const emptyScore = (playerId: string): PlayerScore => ({
  playerId,
  roundsPlayed: 0,
  timesImposter: 0,
  timesCaughtAsImposter: 0,
  timesEscapedAsImposter: 0,
  timesVotedCorrectly: 0,
});

/**
 * Folds one round's result into a running scoreboard for the night. Pure
 * function returning a new map, so it's testable without touching the
 * store. Imposter catch/escape credit is round-level (matching what the
 * Result screen tells players — "Busted" or "Smooth move" — rather than
 * a more granular per-imposter truth the UI never explains), so it stays
 * consistent across both single- and two-imposter rounds, and across the
 * honor system (which can't attribute a catch to one specific imposter).
 */
export function recordRoundInScoreboard(
  scoreboard: Scoreboard,
  players: readonly Player[],
  round: RoundAssignment,
  outcome: RoundOutcome,
  votes: readonly Vote[],
): Scoreboard {
  const next = new Map(scoreboard);
  const getOrCreate = (id: string): PlayerScore => next.get(id) ?? emptyScore(id);

  for (const player of players) {
    const current = getOrCreate(player.id);
    next.set(player.id, { ...current, roundsPlayed: current.roundsPlayed + 1 });
  }

  for (const imposterId of round.imposterIds) {
    const current = getOrCreate(imposterId);
    next.set(imposterId, {
      ...current,
      timesImposter: current.timesImposter + 1,
      timesCaughtAsImposter: current.timesCaughtAsImposter + (outcome.imposterCaught ? 1 : 0),
      timesEscapedAsImposter: current.timesEscapedAsImposter + (outcome.imposterCaught ? 0 : 1),
    });
  }

  for (const vote of votes) {
    if (round.imposterIds.includes(vote.targetId)) {
      const current = getOrCreate(vote.voterId);
      next.set(vote.voterId, { ...current, timesVotedCorrectly: current.timesVotedCorrectly + 1 });
    }
  }

  return next;
}
