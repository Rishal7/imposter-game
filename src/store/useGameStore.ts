import { useMemo } from 'react';
import { create, type StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  assignRound,
  determineOutcome,
  MAX_PLAYERS,
  MIN_PLAYERS,
  recordRoundInScoreboard,
  tallyVotes,
  type Scoreboard,
  type Vote,
} from '@/domain/gameEngine';
import { MathRandomSource } from '@/domain/random';
import type { Category, GameSettings, Player, RoundAssignment, RoundOutcome, WordEntry } from '@/domain/types';
import { StaticWordProvider } from '@/domain/wordProvider';
import { DEFAULT_SETTINGS, GAME_PERSIST_NAME, gameStorage } from '@/lib/gameStorage';

export type GamePhase = 'setup' | 'reveal' | 'discuss' | 'vote' | 'result';
export type VoteView = 'ballot' | 'honor';

const random = new MathRandomSource();

const CATEGORIES = new StaticWordProvider().getCategories();
const DEFAULT_SELECTED_CATEGORY_IDS = CATEGORIES.slice(0, 3).map((category) => category.id);
/** How many past secret words a new round steers away from repeating. */
const RECENT_WORDS_LIMIT = 3;
/** From this many players up, the imposter cooldown extends to two rounds instead of one. */
const IMPOSTER_COOLDOWN_BOOST_THRESHOLD = 4;
const MAX_IMPOSTER_COOLDOWN_ROUNDS = 2;
const imposterCooldownRounds = (playerCount: number): number =>
  playerCount >= IMPOSTER_COOLDOWN_BOOST_THRESHOLD ? 2 : 1;

let nextPlayerId = 0;
const createPlayerId = (): string => `player-${(nextPlayerId += 1)}`;

/**
 * Called after hydration restores a persisted roster, so freshly-created
 * players in this session never reuse an id a restored player already has.
 */
const resyncNextPlayerId = (players: readonly Player[]): void => {
  for (const player of players) {
    const match = /^player-(\d+)$/.exec(player.id);
    if (match) nextPlayerId = Math.max(nextPlayerId, Number(match[1]));
  }
};

const createDefaultPlayers = (): Player[] => [
  { id: createPlayerId(), name: '' },
  { id: createPlayerId(), name: '' },
  { id: createPlayerId(), name: '' },
];

interface GameState {
  readonly phase: GamePhase;
  readonly players: readonly Player[];
  readonly selectedCategoryIds: readonly string[];
  readonly customCategories: readonly Category[];
  readonly settings: GameSettings;
  readonly round: RoundAssignment | null;
  readonly revealedPlayerIds: ReadonlySet<string>;
  readonly votes: readonly Vote[];
  readonly voteView: VoteView;
  readonly outcome: RoundOutcome | null;
  /** The last few secret words drawn, so a new round can steer away from repeats. Not persisted. */
  readonly recentWords: readonly string[];
  /**
   * Imposter id(s) from the last couple of rounds — never more than the
   * largest cooldown window needs — so a new round can steer away from
   * repeating the same imposter too soon. Not persisted.
   */
  readonly recentImposterRounds: readonly (readonly string[])[];
  /** Running tally for the night — folded in after every round's outcome. Not persisted. */
  readonly scoreboard: Scoreboard;

  addPlayer(): void;
  removePlayer(id: string): void;
  renamePlayer(id: string, name: string): void;
  toggleCategory(id: string): void;
  addCustomCategory(name: string, words: readonly WordEntry[]): void;
  updateCustomCategory(id: string, name: string, words: readonly WordEntry[]): void;
  removeCustomCategory(id: string): void;
  toggleImposterSeesCategory(): void;
  toggleImposterGetsHint(): void;
  toggleTwoImposters(): void;

  startGame(): void;
  markRevealed(playerId: string): void;
  goToReveal(): void;
  goToDiscuss(): void;
  goToVote(): void;
  skipVoting(): void;
  setVoteView(view: VoteView): void;
  castVote(voterId: string, targetId: string): void;
  finishVoting(): void;
  skipVotingWithOutcome(imposterCaught: boolean): void;
  playAgain(): void;
  backToSetup(): void;
  resetScoreboard(): void;
}

const displayName = (player: Player, index: number): string => player.name.trim() || `Player ${index + 1}`;

const createGameState: StateCreator<GameState> = (set, get) => ({
  phase: 'setup',
  players: createDefaultPlayers(),
  selectedCategoryIds: DEFAULT_SELECTED_CATEGORY_IDS,
  customCategories: [],
  settings: DEFAULT_SETTINGS,
  round: null,
  revealedPlayerIds: new Set(),
  votes: [],
  voteView: 'ballot',
  outcome: null,
  recentWords: [],
  recentImposterRounds: [],
  scoreboard: new Map(),

  addPlayer: () =>
    set((state) => {
      if (state.players.length >= MAX_PLAYERS) return state;
      return { players: [...state.players, { id: createPlayerId(), name: '' }] };
    }),

  removePlayer: (id) =>
    set((state) => {
      if (state.players.length <= MIN_PLAYERS) return state;
      return { players: state.players.filter((player) => player.id !== id) };
    }),

  renamePlayer: (id, name) =>
    set((state) => ({
      players: state.players.map((player) => (player.id === id ? { ...player, name } : player)),
    })),

  toggleCategory: (id) =>
    set((state) => ({
      selectedCategoryIds: state.selectedCategoryIds.includes(id)
        ? state.selectedCategoryIds.filter((categoryId) => categoryId !== id)
        : [...state.selectedCategoryIds, id],
    })),

  addCustomCategory: (name, words) =>
    set((state) => {
      const category: Category = { id: `custom-${crypto.randomUUID()}`, name: name.trim(), words };
      return {
        customCategories: [...state.customCategories, category],
        selectedCategoryIds: [...state.selectedCategoryIds, category.id],
      };
    }),

  updateCustomCategory: (id, name, words) =>
    set((state) => ({
      customCategories: state.customCategories.map((category) =>
        category.id === id ? { ...category, name: name.trim(), words } : category,
      ),
    })),

  removeCustomCategory: (id) =>
    set((state) => ({
      customCategories: state.customCategories.filter((category) => category.id !== id),
      selectedCategoryIds: state.selectedCategoryIds.filter((categoryId) => categoryId !== id),
    })),

  toggleImposterSeesCategory: () =>
    set((state) => ({ settings: { ...state.settings, imposterSeesCategory: !state.settings.imposterSeesCategory } })),

  toggleImposterGetsHint: () =>
    set((state) => ({ settings: { ...state.settings, imposterGetsHint: !state.settings.imposterGetsHint } })),

  toggleTwoImposters: () =>
    set((state) => ({ settings: { ...state.settings, twoImposters: !state.settings.twoImposters } })),

  startGame: () => {
    const { players, selectedCategoryIds, customCategories, settings, recentWords, recentImposterRounds } = get();
    const wordProvider = new StaticWordProvider([...CATEGORIES, ...customCategories]);
    const cooldown = imposterCooldownRounds(players.length);
    const excludeImposterIds = new Set(recentImposterRounds.slice(-cooldown).flat());
    const round = assignRound({
      players,
      categoryIds: selectedCategoryIds,
      settings,
      wordProvider,
      random,
      excludeWords: new Set(recentWords),
      excludeImposterIds,
    });
    set({
      phase: 'reveal',
      round,
      revealedPlayerIds: new Set(),
      votes: [],
      voteView: 'ballot',
      outcome: null,
      recentWords: [...recentWords, round.secretWord].slice(-RECENT_WORDS_LIMIT),
      recentImposterRounds: [...recentImposterRounds, round.imposterIds].slice(-MAX_IMPOSTER_COOLDOWN_ROUNDS),
    });
  },

  markRevealed: (playerId) =>
    set((state) => ({ revealedPlayerIds: new Set(state.revealedPlayerIds).add(playerId) })),

  goToReveal: () => set({ phase: 'reveal' }),
  goToDiscuss: () => set({ phase: 'discuss' }),
  goToVote: () => set({ phase: 'vote', voteView: 'ballot' }),
  skipVoting: () => set({ phase: 'vote', voteView: 'honor' }),
  setVoteView: (view) => set({ voteView: view }),

  castVote: (voterId, targetId) =>
    set((state) => ({
      votes: [...state.votes.filter((vote) => vote.voterId !== voterId), { voterId, targetId }],
    })),

  finishVoting: () => {
    const { players, votes, round, scoreboard } = get();
    if (!round) return;
    const [topResult] = tallyVotes(players, votes);
    const votedOutId = topResult && topResult.votes > 0 ? topResult.playerId : null;
    const outcome = determineOutcome(votedOutId, round.imposterIds);
    set({ outcome, phase: 'result', scoreboard: recordRoundInScoreboard(scoreboard, players, round, outcome, votes) });
  },

  skipVotingWithOutcome: (imposterCaught) => {
    const { players, votes, round, scoreboard } = get();
    if (!round) return;
    const outcome: RoundOutcome = { votedOutId: null, imposterIds: round.imposterIds, imposterCaught };
    set({ outcome, phase: 'result', scoreboard: recordRoundInScoreboard(scoreboard, players, round, outcome, votes) });
  },

  playAgain: () => get().startGame(),

  backToSetup: () => set({ phase: 'setup', round: null, votes: [], outcome: null }),

  resetScoreboard: () => set({ scoreboard: new Map() }),
});

/**
 * Custom word packs, rule settings, and the player roster survive a
 * reload — round, votes, and phase intentionally reset every session.
 * `persist` hydrates them from localStorage synchronously before first
 * render; `onRehydrateStorage` then resyncs the id counter so a player
 * added in a new session never collides with a restored id.
 */
export const useGameStore = create<GameState>()(
  persist(createGameState, {
    name: GAME_PERSIST_NAME,
    storage: gameStorage,
    partialize: (state) => ({
      customCategories: state.customCategories as Category[],
      settings: state.settings,
      players: state.players as Player[],
    }),
    onRehydrateStorage: () => (state) => {
      if (state) resyncNextPlayerId(state.players);
    },
  }),
);

export const getCategories = () => CATEGORIES;
export const getPlayerDisplayName = displayName;

/** Built-in categories plus whatever custom word packs the player has saved. */
export const useAllCategories = (): readonly Category[] => {
  const customCategories = useGameStore((state) => state.customCategories);
  return useMemo(() => [...CATEGORIES, ...customCategories], [customCategories]);
};
