export interface Player {
  readonly id: string;
  readonly name: string;
}

/** A word paired with its own imposter hint — authored together, not derived. */
export interface WordEntry {
  readonly word: string;
  readonly hint: string;
}

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly words: readonly WordEntry[];
}

export interface GameSettings {
  readonly imposterSeesCategory: boolean;
  readonly imposterGetsHint: boolean;
  /** Only takes effect with enough players — see `MIN_PLAYERS_FOR_TWO_IMPOSTERS`. */
  readonly twoImposters: boolean;
}

export type PlayerRole =
  | { readonly kind: 'civilian'; readonly word: string }
  | {
      readonly kind: 'imposter';
      readonly hint: string | null;
      readonly category: string | null;
      /** The other imposter this round, when there are two. */
      readonly teammateId: string | null;
    };

export interface RoundAssignment {
  readonly categoryId: string;
  readonly categoryName: string;
  readonly secretWord: string;
  readonly imposterIds: readonly string[];
  readonly roles: ReadonlyMap<string, PlayerRole>;
}

export interface VoteTally {
  readonly playerId: string;
  readonly votes: number;
}

export interface RoundOutcome {
  readonly votedOutId: string | null;
  readonly imposterIds: readonly string[];
  readonly imposterCaught: boolean;
}
