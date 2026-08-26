import { XIcon } from '@/components/icons';
import { cn } from '@/lib/cn';

interface CategoryTileProps {
  name: string;
  wordCount: number;
  selected: boolean;
  onToggle: () => void;
  onRemove?: () => void;
}

export function CategoryTile({ name, wordCount, selected, onToggle, onRemove }: CategoryTileProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-[14px] border px-3 py-3 text-left',
        selected ? 'border-amber bg-amber/15' : 'border-line/25 bg-surface-2',
      )}
    >
      <div className="flex items-start justify-between gap-1">
        <button type="button" onClick={onToggle} className="flex flex-1 flex-col gap-1.5 text-left">
          <span className="text-[13px] font-bold text-text">{name}</span>
          <span className="text-[11px] text-text-dim">{wordCount} words</span>
        </button>
        {onRemove ? (
          <button type="button" onClick={onRemove} aria-label={`Delete ${name} pack`} className="p-0.5 text-text-dim">
            <XIcon width={12} height={12} strokeWidth={2.6} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
