import { Avatar } from '@/components/atoms/Avatar';
import { CheckIcon } from '@/components/icons';
import type { Player } from '@/domain/types';
import { getPlayerDisplayName } from '@/store/useGameStore';

interface PlayerAvatarGridProps {
  players: readonly Player[];
  isDone: (playerId: string) => boolean;
  onSelect: (playerId: string) => void;
}

/** The tap-your-own-name grid shared by the reveal and voting phases. */
export function PlayerAvatarGrid({ players, isDone, onSelect }: PlayerAvatarGridProps) {
  return (
    <div className="grid grid-cols-3 gap-y-4 gap-x-2.5 pt-1 sm:grid-cols-4 md:grid-cols-5">
      {players.map((player, index) => {
        const done = isDone(player.id);
        return (
          <button
            key={player.id}
            type="button"
            onClick={() => onSelect(player.id)}
            className="flex flex-col items-center gap-2"
          >
            <Avatar
              name={getPlayerDisplayName(player, index)}
              paletteIndex={index}
              size="lg"
              badge={
                done ? (
                  <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-bg bg-amber md:h-6 md:w-6">
                    <CheckIcon width={11} height={11} strokeWidth={3.4} className="text-amber-ink" />
                  </div>
                ) : null
              }
            />
            <div className="truncate text-xs font-semibold text-text-dim sm:text-[13px]">
              {getPlayerDisplayName(player, index)}
            </div>
          </button>
        );
      })}
    </div>
  );
}
