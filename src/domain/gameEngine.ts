import type { RandomSource } from './random';
import { pickRandom } from './random';
import type { GameSettings, Player, PlayerRole, RoundAssignment, RoundOutcome, VoteTally } from './types';
import type { WordProvider } from './wordProvider';

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;

export interface AssignRoundParams {
  readonly players: readonly Player[];
  readonly categoryIds: readonly string[];
  readonly settings: GameSettings;
  readonly wordProvider: WordProvider;
  readonly random: RandomSource;
}

/**
 * Draws a secret word and picks the imposter for one round. Pure function:
 * every dependency (word source, randomness) is passed in, so the same
 * inputs always produce a reproducible shape and the logic can be unit
 * tested without mocking modules.
 */
export function assignRound(params: AssignRoundParams): RoundAssignment {
  const { players, categoryIds, settings, wordProvider, random } = params;

  if (players.length < MIN_PLAYERS) {
    throw new Error(`A round needs at least ${MIN_PLAYERS} players.`);
  }

  const { category, entry } = wordProvider.pickSecretWord(categoryIds, random);
  const word = entry.word;
  const imposter = pickRandom(players, random);
  const hintWord = settings.imposterGetsHint ? entry.hint : null;

  const roles = new Map<string, PlayerRole>(
    players.map((player): [string, PlayerRole] => {
      if (player.id === imposter.id) {
        return [
          player.id,
          {
            kind: 'imposter',
            hint: hintWord,
            category: settings.imposterSeesCategory ? category.name : null,
          },
        ];
      }
      return [player.id, { kind: 'civilian', word }];
    }),
  );

  return {
    categoryId: category.id,
    categoryName: category.name,
    secretWord: word,
    imposterId: imposter.id,
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

export function determineOutcome(votedOutId: string | null, imposterId: string): RoundOutcome {
  return {
    votedOutId,
    imposterId,
    imposterCaught: votedOutId !== null && votedOutId === imposterId,
  };
}
