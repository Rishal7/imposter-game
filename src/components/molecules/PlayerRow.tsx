import { TrashIcon } from '@/components/icons';

interface PlayerRowProps {
  index: number;
  name: string;
  onRename: (name: string) => void;
  onRemove: () => void;
  removable: boolean;
}

export function PlayerRow({ index, name, onRename, onRemove, removable }: PlayerRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-dashed border-line/25 py-3">
      <div className="font-display text-lg font-extrabold text-line/70 tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </div>
      <input
        value={name}
        onChange={(event) => onRename(event.target.value)}
        placeholder={`Player ${index + 1}`}
        className="min-w-0 flex-1 bg-transparent py-1 text-[15px] font-semibold text-text placeholder:text-text-dim placeholder:font-medium focus:outline-none"
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!removable}
        aria-label={`Remove player ${index + 1}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center text-text-dim disabled:opacity-20"
      >
        <TrashIcon width={15} height={15} />
      </button>
    </div>
  );
}
