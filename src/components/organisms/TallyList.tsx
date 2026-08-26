import { TallyBar } from '@/components/molecules/TallyBar';
import type { VoteTally } from '@/domain/types';

interface TallyListProps {
  tally: readonly VoteTally[];
  nameFor: (playerId: string) => string;
  paletteIndexFor: (playerId: string) => number;
}

export function TallyList({ tally, nameFor, paletteIndexFor }: TallyListProps) {
  const maxVotes = Math.max(1, ...tally.map((entry) => entry.votes));

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[11px] font-bold uppercase tracking-widest text-text-dim">Vote tally</div>
      {tally.map((entry) => (
        <TallyBar
          key={entry.playerId}
          name={nameFor(entry.playerId)}
          paletteIndex={paletteIndexFor(entry.playerId)}
          votes={entry.votes}
          percent={Math.max(6, Math.round((entry.votes / maxVotes) * 100))}
        />
      ))}
    </div>
  );
}
