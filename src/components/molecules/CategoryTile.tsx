import { cn } from '@/lib/cn';

interface CategoryTileProps {
  name: string;
  wordCount: number;
  selected: boolean;
  onToggle: () => void;
}

export function CategoryTile({ name, wordCount, selected, onToggle }: CategoryTileProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'flex flex-col gap-1.5 rounded-[14px] border px-3 py-3 text-left',
        selected ? 'border-amber bg-amber/15' : 'border-line/25 bg-surface-2',
      )}
    >
      <span className="text-[13px] font-bold text-text">{name}</span>
      <span className="text-[11px] text-text-dim">{wordCount} words</span>
    </button>
  );
}
