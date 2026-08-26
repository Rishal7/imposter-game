import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { PlusIcon, XIcon } from '@/components/icons';
import { WordPairRow } from '@/components/molecules/WordPairRow';
import type { WordEntry } from '@/domain/types';

interface DraftRow {
  word: string;
  hint: string;
}

interface CustomCategoryModalProps {
  onSave: (name: string, words: readonly WordEntry[]) => void;
  onClose: () => void;
}

const emptyRow = (): DraftRow => ({ word: '', hint: '' });

export function CustomCategoryModal({ onSave, onClose }: CustomCategoryModalProps) {
  const [name, setName] = useState('');
  const [rows, setRows] = useState<DraftRow[]>([emptyRow(), emptyRow()]);

  const validWords: WordEntry[] = rows
    .map((row) => ({ word: row.word.trim(), hint: row.hint.trim() }))
    .filter((row) => row.word.length > 0 && row.hint.length > 0);
  const canSave = name.trim().length > 0 && validWords.length > 0;

  const updateRow = (index: number, patch: Partial<DraftRow>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const removeRow = (index: number) => setRows((current) => current.filter((_, i) => i !== index));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg/96 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <span className="text-sm font-bold text-text">New word pack</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-text-dim"
        >
          <XIcon width={15} height={15} strokeWidth={2.4} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-3 pb-4">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Pack name"
          className="mb-4 w-full rounded-xl border border-line/25 bg-surface-2 px-3 py-3 font-display text-base font-extrabold text-text placeholder:text-text-dim placeholder:font-extrabold focus:outline-2 focus:outline-amber"
        />

        <div className="flex flex-col gap-2.5">
          {rows.map((row, index) => (
            <WordPairRow
              key={index}
              index={index}
              word={row.word}
              hint={row.hint}
              onChangeWord={(word) => updateRow(index, { word })}
              onChangeHint={(hint) => updateRow(index, { hint })}
              onRemove={() => removeRow(index)}
              removable={rows.length > 1}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setRows((current) => [...current, emptyRow()])}
          className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-line/25 bg-surface-2 py-3 text-[13px] font-semibold text-text-dim"
        >
          <PlusIcon width={15} height={15} />
          Add Word
        </button>
      </div>

      <div className="px-6 pt-2 pb-6">
        <Button
          disabled={!canSave}
          onClick={() => {
            if (!canSave) return;
            onSave(name, validWords);
            onClose();
          }}
        >
          Save Pack
        </Button>
      </div>
    </div>
  );
}
