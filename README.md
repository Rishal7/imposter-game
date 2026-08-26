# Imposter

A pass-and-play social deduction party game. Vite + React + TypeScript,
installable as a PWA. No backend — one device, passed around the table.

## Stack

- **Vite + React 19 + TypeScript** — no router; the whole session is one
  linear flow, so a `phase` field in the store is the only "routing" needed.
- **Zustand** for state — a single store, but it stays thin: it holds state
  and delegates the actual game rules to `src/domain`.
- **Tailwind CSS v4** for styling, **vite-plugin-pwa** for the installable/
  offline shell.
- **Vitest** for the domain layer's unit tests.

## Architecture

```
src/
  domain/       game rules — plain TypeScript, zero React/store dependency
  store/        Zustand store — owns state, calls into domain for logic
  components/   atoms → molecules → organisms → templates (atomic design)
  pages/        one per game phase; wires store state/actions to components
```

**`domain/`** is where the actual game lives: assigning roles, tallying
votes, deciding the outcome. It never imports React or Zustand, so it's
tested in isolation (`gameEngine.test.ts`) with a fake, deterministic
`RandomSource` instead of `Math.random`. Swapping the word bank for a
remote pack later means writing a new `WordProvider` — the engine
doesn't change.

**`components/`** is strictly presentational — every atom/molecule/organism
takes props and renders; none of them import the store. `pages/` is the
only layer that reads from `useGameStore` and hands plain data down. This
split is what keeps a component reusable (e.g. `PlayerAvatarGrid` backs
both the reveal and voting screens) and testable without a store.

## Commands

```bash
npm run dev        # start the dev server
npm run build       # typecheck + production build
npm run preview     # serve the production build
npm run test         # run domain unit tests
npm run lint         # eslint
npm run typecheck   # tsc, no emit
```

Requires Node 22+ (developed against the latest Node 24; see `.nvmrc`).
