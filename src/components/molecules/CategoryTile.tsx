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
    <span
      className={cn(
        'cut-sm cut flex items-center gap-2 border py-2.5 pr-2.5 pl-4 text-left transition-colors',
        selected ? 'border-primary bg-primary/15 text-primary' : 'border-line/25 bg-surface-2 text-text-dim',
      )}
    >
      <button type="button" onClick={onToggle} className="flex items-center gap-2">
        <span className="text-[13px] font-bold">{name}</span>
        <span className="text-[11px] opacity-70">· {wordCount}</span>
      </button>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Delete ${name} pack`}
          className="flex h-5 w-5 items-center justify-center opacity-60"
        >
          <XIcon width={11} height={11} strokeWidth={2.6} />
        </button>
      ) : null}
    </span>
  );
}
