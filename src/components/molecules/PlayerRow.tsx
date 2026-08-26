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
    <div className="flex items-center gap-2.5">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-amber/15 font-display text-[13px] font-bold text-amber">
        {index + 1}
      </div>
      <input
        value={name}
        onChange={(event) => onRename(event.target.value)}
        placeholder={`Player ${index + 1}`}
        className="min-w-0 flex-1 rounded-xl border border-line/25 bg-surface-2 px-3 py-2.5 text-base font-semibold text-text placeholder:text-text-dim placeholder:font-medium focus:outline-2 focus:outline-amber"
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!removable}
        aria-label={`Remove player ${index + 1}`}
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] text-text-dim disabled:opacity-30"
      >
        <TrashIcon width={16} height={16} />
      </button>
    </div>
  );
}
