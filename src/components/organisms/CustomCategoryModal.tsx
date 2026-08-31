import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { PlusIcon, XIcon } from '@/components/icons';
import { WordPairRow } from '@/components/molecules/WordPairRow';
import type { Category, WordEntry } from '@/domain/types';

interface DraftRow {
  word: string;
  hint: string;
}

interface CustomCategoryModalProps {
  /** When set, the modal edits this pack in place instead of creating a new one. */
  initialCategory?: Category;
  onSave: (name: string, words: readonly WordEntry[]) => void;
  onClose: () => void;
}

const emptyRow = (): DraftRow => ({ word: '', hint: '' });

export function CustomCategoryModal({ initialCategory, onSave, onClose }: CustomCategoryModalProps) {
  const isEditing = initialCategory !== undefined;
  const [name, setName] = useState(initialCategory?.name ?? '');
  const [rows, setRows] = useState<DraftRow[]>(
    initialCategory ? initialCategory.words.map((entry) => ({ ...entry })) : [emptyRow(), emptyRow()],
  );

  const validWords: WordEntry[] = rows
    .map((row) => ({ word: row.word.trim(), hint: row.hint.trim() }))
    .filter((row) => row.word.length > 0 && row.hint.length > 0);
  const canSave = name.trim().length > 0 && validWords.length > 0;

  const updateRow = (index: number, patch: Partial<DraftRow>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const removeRow = (index: number) => setRows((current) => current.filter((_, i) => i !== index));

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-bg/96 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col sm:max-w-lg md:max-w-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-text-dim">
            {isEditing ? 'Edit word pack' : 'New word pack'}
          </span>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-text-dim">
            <XIcon width={16} height={16} strokeWidth={2.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-3 pb-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Pack name"
            className="mb-4 w-full border-b border-dashed border-line/25 bg-transparent py-2 font-display text-lg font-extrabold text-text placeholder:text-text-dim placeholder:font-extrabold focus:outline-none"
          />

          <div className="flex flex-col">
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
            className="flex items-center gap-2 py-4 text-[13px] font-bold uppercase tracking-wide text-primary"
          >
            <PlusIcon width={14} height={14} strokeWidth={2.4} />
            Add word
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
            {isEditing ? 'Save changes' : 'Save pack'}
          </Button>
        </div>
      </div>
    </div>
  );
}
