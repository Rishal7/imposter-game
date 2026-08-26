import { Avatar } from '@/components/atoms/Avatar';
import { XIcon } from '@/components/icons';
import type { Player } from '@/domain/types';
import { cn } from '@/lib/cn';

interface BallotListProps {
  targets: readonly { player: Player; paletteIndex: number; displayName: string }[];
  selectedId: string | null;
  onSelect: (playerId: string) => void;
}

/** A ballot sheet: numbered rows you mark, not an avatar pile with checkboxes. */
export function BallotList({ targets, selectedId, onSelect }: BallotListProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {targets.map(({ player, paletteIndex, displayName }, index) => {
        const selected = selectedId === player.id;
        return (
          <button
            key={player.id}
            type="button"
            onClick={() => onSelect(player.id)}
            className={cn(
              'flex items-center gap-3.5 border-b border-dashed py-3.5 text-left transition-colors',
              selected ? 'border-danger/40' : 'border-line/25',
            )}
          >
            <div className="font-display text-sm font-extrabold text-line/70 tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </div>
            <Avatar name={displayName} paletteIndex={paletteIndex} size="sm" />
            <div className="flex-1 text-[15px] font-semibold text-text">{displayName}</div>
            <div
              className={cn(
                'cut-sm cut flex h-7 w-7 shrink-0 items-center justify-center border-2',
                selected ? 'border-danger bg-danger' : 'border-line/30',
              )}
            >
              {selected ? <XIcon width={13} height={13} strokeWidth={3} className="text-primary-ink" /> : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
