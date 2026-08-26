import { TrashIcon } from '@/components/icons';

interface WordPairRowProps {
  index: number;
  word: string;
  hint: string;
  onChangeWord: (word: string) => void;
  onChangeHint: (hint: string) => void;
  onRemove: () => void;
  removable: boolean;
}

export function WordPairRow({ index, word, hint, onChangeWord, onChangeHint, onRemove, removable }: WordPairRowProps) {
  return (
    <div className="flex items-center gap-2 border-b border-dashed border-line/25 py-2.5">
      <div className="font-display text-sm font-extrabold text-line/70 tabular-nums">
        {String(index + 1).padStart(2, '0')}
      </div>
      <input
        value={word}
        onChange={(event) => onChangeWord(event.target.value)}
        placeholder="Word"
        className="min-w-0 flex-1 bg-transparent py-1 text-base font-semibold text-text placeholder:text-text-dim placeholder:font-medium focus:outline-none"
      />
      <input
        value={hint}
        onChange={(event) => onChangeHint(event.target.value)}
        placeholder="Imposter hint"
        className="min-w-0 flex-1 bg-transparent py-1 text-base text-text-dim placeholder:text-text-dim/60 focus:outline-none"
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!removable}
        aria-label={`Remove word ${index + 1}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center text-text-dim disabled:opacity-20"
      >
        <TrashIcon width={14} height={14} />
      </button>
    </div>
  );
}
