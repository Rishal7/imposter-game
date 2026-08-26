import { create } from 'zustand';

import { assignRound, determineOutcome, MAX_PLAYERS, MIN_PLAYERS, tallyVotes, type Vote } from '@/domain/gameEngine';
import { MathRandomSource } from '@/domain/random';
import type { Category, GameSettings, Player, RoundAssignment, RoundOutcome, WordEntry } from '@/domain/types';
import { StaticWordProvider } from '@/domain/wordProvider';
import { loadCustomCategories, saveCustomCategories } from '@/lib/customCategoryStorage';

export type GamePhase = 'setup' | 'reveal' | 'discuss' | 'vote' | 'result';
export type VoteView = 'ballot' | 'honor';

const random = new MathRandomSource();

const CATEGORIES = new StaticWordProvider().getCategories();
const DEFAULT_SELECTED_CATEGORY_IDS = CATEGORIES.slice(0, 3).map((category) => category.id);
const INITIAL_CUSTOM_CATEGORIES = loadCustomCategories();

let nextPlayerId = 0;
const createPlayerId = (): string => `player-${(nextPlayerId += 1)}`;

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

  addPlayer(): void;
  removePlayer(id: string): void;
  renamePlayer(id: string, name: string): void;
  toggleCategory(id: string): void;
  addCustomCategory(name: string, words: readonly WordEntry[]): void;
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
}

const displayName = (player: Player, index: number): string => player.name.trim() || `Player ${index + 1}`;

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'setup',
  players: createDefaultPlayers(),
  selectedCategoryIds: DEFAULT_SELECTED_CATEGORY_IDS,
  customCategories: INITIAL_CUSTOM_CATEGORIES,
  settings: { imposterSeesCategory: false, imposterGetsHint: true, twoImposters: false },
  round: null,
  revealedPlayerIds: new Set(),
  votes: [],
  voteView: 'ballot',
  outcome: null,

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
      const customCategories = [...state.customCategories, category];
      saveCustomCategories(customCategories);
      return { customCategories, selectedCategoryIds: [...state.selectedCategoryIds, category.id] };
    }),

  removeCustomCategory: (id) =>
    set((state) => {
      const customCategories = state.customCategories.filter((category) => category.id !== id);
      saveCustomCategories(customCategories);
      return {
        customCategories,
        selectedCategoryIds: state.selectedCategoryIds.filter((categoryId) => categoryId !== id),
      };
    }),

  toggleImposterSeesCategory: () =>
    set((state) => ({ settings: { ...state.settings, imposterSeesCategory: !state.settings.imposterSeesCategory } })),

  toggleImposterGetsHint: () =>
    set((state) => ({ settings: { ...state.settings, imposterGetsHint: !state.settings.imposterGetsHint } })),

  toggleTwoImposters: () =>
    set((state) => ({ settings: { ...state.settings, twoImposters: !state.settings.twoImposters } })),

  startGame: () => {
    const { players, selectedCategoryIds, customCategories, settings } = get();
    const wordProvider = new StaticWordProvider([...CATEGORIES, ...customCategories]);
    const round = assignRound({
      players,
      categoryIds: selectedCategoryIds,
      settings,
      wordProvider,
      random,
    });
    set({ phase: 'reveal', round, revealedPlayerIds: new Set(), votes: [], voteView: 'ballot', outcome: null });
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
    const { players, votes, round } = get();
    if (!round) return;
    const [topResult] = tallyVotes(players, votes);
    const votedOutId = topResult && topResult.votes > 0 ? topResult.playerId : null;
    set({ outcome: determineOutcome(votedOutId, round.imposterIds), phase: 'result' });
  },

  skipVotingWithOutcome: (imposterCaught) => {
    const { round } = get();
    if (!round) return;
    set({
      outcome: { votedOutId: null, imposterIds: round.imposterIds, imposterCaught },
      phase: 'result',
    });
  },

  playAgain: () => get().startGame(),

  backToSetup: () => set({ phase: 'setup', round: null, votes: [], outcome: null }),
}));

export const getCategories = () => CATEGORIES;
export const getPlayerDisplayName = displayName;

/** Built-in categories plus whatever custom word packs the player has saved. */
export const useAllCategories = (): readonly Category[] => {
  const customCategories = useGameStore((state) => state.customCategories);
  return [...CATEGORIES, ...customCategories];
};
