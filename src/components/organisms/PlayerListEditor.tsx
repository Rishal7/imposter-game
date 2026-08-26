import { PlusIcon } from '@/components/icons';
import { PlayerRow } from '@/components/molecules/PlayerRow';
import type { Player } from '@/domain/types';

interface PlayerListEditorProps {
  players: readonly Player[];
  minPlayers: number;
  maxPlayers: number;
  onRename: (id: string, name: string) => void;
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export function PlayerListEditor({ players, minPlayers, maxPlayers, onRename, onRemove, onAdd }: PlayerListEditorProps) {
  const canAdd = players.length < maxPlayers;

  return (
    <div className="flex flex-col">
      {players.map((player, index) => (
        <PlayerRow
          key={player.id}
          index={index}
          name={player.name}
          onRename={(name) => onRename(player.id, name)}
          onRemove={() => onRemove(player.id)}
          removable={players.length > minPlayers}
        />
      ))}

      {canAdd ? (
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 py-4 text-[13px] font-bold uppercase tracking-wide text-primary"
        >
          <PlusIcon width={14} height={14} strokeWidth={2.4} />
          Add another
        </button>
      ) : null}
    </div>
  );
}
