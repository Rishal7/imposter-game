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
    <div className="flex items-center gap-2">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-amber/15 font-display text-[13px] font-bold text-amber">
        {index + 1}
      </div>
      <input
        value={word}
        onChange={(event) => onChangeWord(event.target.value)}
        placeholder="Word"
        className="min-w-0 flex-1 rounded-xl border border-line/25 bg-surface-2 px-3 py-2.5 text-base font-semibold text-text placeholder:text-text-dim placeholder:font-medium focus:outline-2 focus:outline-amber"
      />
      <input
        value={hint}
        onChange={(event) => onChangeHint(event.target.value)}
        placeholder="Hint"
        className="min-w-0 flex-1 rounded-xl border border-line/25 bg-surface-2 px-3 py-2.5 text-base text-text-dim placeholder:text-text-dim/70 focus:outline-2 focus:outline-amber"
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!removable}
        aria-label={`Remove word ${index + 1}`}
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] text-text-dim disabled:opacity-30"
      >
        <TrashIcon width={15} height={15} />
      </button>
    </div>
  );
}
