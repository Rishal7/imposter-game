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
        'cut-sm cut flex items-center gap-2 border px-4 py-2.5 text-left transition-colors',
        selected ? 'border-primary bg-primary/15 text-primary' : 'border-line/25 bg-surface-2 text-text-dim',
      )}
    >
      <span className="text-[13px] font-bold">{name}</span>
      <span className="text-[11px] opacity-70">· {wordCount}</span>
    </button>
  );
}
