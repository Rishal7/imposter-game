import { Avatar } from '@/components/atoms/Avatar';
import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import type { Player } from '@/domain/types';
import { cn } from '@/lib/cn';
import { getPlayerDisplayName } from '@/store/useGameStore';

interface PlayerTicketListProps {
  players: readonly Player[];
  isDone: (playerId: string) => boolean;
  doneLabel: string;
  pendingLabel: string;
  onSelect: (playerId: string) => void;
  /** Once true and a row isDone, that row can no longer be tapped again. */
  lockWhenDone?: boolean;
}

/** A vertical ticket-row list — the tap-your-name step shared by reveal and voting. */
export function PlayerTicketList({
  players,
  isDone,
  doneLabel,
  pendingLabel,
  onSelect,
  lockWhenDone = false,
}: PlayerTicketListProps) {
  return (
    <div className="flex flex-col">
      {players.map((player, index) => {
        const done = isDone(player.id);
        const locked = done && lockWhenDone;
        const name = getPlayerDisplayName(player, index);
        return (
          <button
            key={player.id}
            type="button"
            onClick={() => onSelect(player.id)}
            disabled={locked}
            className={cn(
              'flex items-center gap-3.5 border-b border-dashed border-line/25 py-3.5 text-left',
              locked && 'opacity-40',
            )}
          >
            <Avatar name={name} paletteIndex={index} size="md" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[15px] font-bold text-text">{name}</div>
              <div className={cn('text-[11px] font-semibold uppercase tracking-wide', done ? 'text-accent' : 'text-text-dim')}>
                {done ? doneLabel : pendingLabel}
              </div>
            </div>
            {done ? (
              <CheckIcon width={16} height={16} strokeWidth={3} className="shrink-0 text-accent" />
            ) : (
              <ArrowRightIcon width={16} height={16} strokeWidth={2.4} className="shrink-0 text-text-dim" />
            )}
          </button>
        );
      })}
    </div>
  );
}
