import { Avatar } from '@/components/atoms/Avatar';
import { CheckIcon } from '@/components/icons';
import type { Player } from '@/domain/types';
import { cn } from '@/lib/cn';

interface VoteTargetListProps {
  targets: readonly { player: Player; paletteIndex: number; displayName: string }[];
  selectedId: string | null;
  onSelect: (playerId: string) => void;
}

export function VoteTargetList({ targets, selectedId, onSelect }: VoteTargetListProps) {
  return (
    <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto">
      {targets.map(({ player, paletteIndex, displayName }) => {
        const selected = selectedId === player.id;
        return (
          <button
            key={player.id}
            type="button"
            onClick={() => onSelect(player.id)}
            className={cn(
              'flex items-center gap-3.5 rounded-2xl border p-3',
              selected ? 'border-red bg-red/10' : 'border-line/25 bg-surface',
            )}
          >
            <Avatar name={displayName} paletteIndex={paletteIndex} size="md" />
            <div className="flex-1 text-left text-[15px] font-semibold text-text">{displayName}</div>
            <div
              className={cn(
                'flex h-[22px] w-[22px] items-center justify-center rounded-full border',
                selected ? 'border-red bg-red' : 'border-line/40',
              )}
            >
              {selected ? <CheckIcon width={12} height={12} strokeWidth={3} className="text-amber-ink" /> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
