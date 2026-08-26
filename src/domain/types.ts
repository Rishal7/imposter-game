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
}

export type PlayerRole =
  | { readonly kind: 'civilian'; readonly word: string }
  | { readonly kind: 'imposter'; readonly hint: string | null; readonly category: string | null };

export interface RoundAssignment {
  readonly categoryId: string;
  readonly categoryName: string;
  readonly secretWord: string;
  readonly imposterId: string;
  readonly roles: ReadonlyMap<string, PlayerRole>;
}

export interface VoteTally {
  readonly playerId: string;
  readonly votes: number;
}

export interface RoundOutcome {
  readonly votedOutId: string | null;
  readonly imposterId: string;
  readonly imposterCaught: boolean;
}
