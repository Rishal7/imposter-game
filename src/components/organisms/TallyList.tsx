import { Card } from '@/components/atoms/Card';
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
    <Card>
      <div className="text-xs font-bold uppercase tracking-wide text-text-dim">Vote Tally</div>
      {tally.map((entry) => (
        <TallyBar
          key={entry.playerId}
          name={nameFor(entry.playerId)}
          paletteIndex={paletteIndexFor(entry.playerId)}
          votes={entry.votes}
          percent={Math.max(6, Math.round((entry.votes / maxVotes) * 100))}
        />
      ))}
    </Card>
  );
}
