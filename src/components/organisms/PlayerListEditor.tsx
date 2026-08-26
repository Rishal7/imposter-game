import { Card } from '@/components/atoms/Card';
import { PlusIcon, UsersIcon } from '@/components/icons';
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
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-text">
          <UsersIcon width={16} height={16} className="text-text-dim" />
          Players
        </div>
        <div className="text-[13px] text-text-dim">
          {players.length} / {maxPlayers}
        </div>
      </div>

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
          className="flex items-center justify-center gap-2 rounded-xl border border-line/25 bg-surface-2 py-3 text-[13px] font-semibold text-text-dim"
        >
          <PlusIcon width={15} height={15} />
          Add Player
        </button>
      ) : null}
    </Card>
  );
}
