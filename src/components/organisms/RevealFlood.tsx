import { useState } from 'react';

import { HandTapIcon } from '@/components/icons';
import type { PlayerRole } from '@/domain/types';
import { cn } from '@/lib/cn';

interface RevealFloodProps {
  role: PlayerRole;
  categoryName: string;
  /** The other imposter's display name, when this round has two. */
  teammateName?: string | null;
  revealed: boolean;
  onReveal: () => void;
}

/** The reveal moment floods its whole panel with color instead of a small centered card. */
export function RevealFlood({ role, categoryName, teammateName, revealed, onReveal }: RevealFloodProps) {
  const [categoryShown, setCategoryShown] = useState(false);

  return (
    <button
      type="button"
      onClick={onReveal}
      disabled={revealed}
      className={cn(
        'relative flex h-full w-full flex-col items-center justify-center gap-4 overflow-hidden px-6 text-center',
        !revealed && 'bg-[repeating-linear-gradient(135deg,var(--color-surface-2)_0_14px,var(--color-surface)_14px_28px)]',
        revealed && role.kind === 'civilian' && 'bg-primary',
        revealed && role.kind === 'imposter' && 'bg-danger',
      )}
    >
      {!revealed && (
        <div className="flex items-center gap-2 border border-line/30 bg-bg/70 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-text">
          <HandTapIcon width={15} height={15} />
          Tap to peek
        </div>
      )}

      {revealed && role.kind === 'imposter' && (
        <>
          <div className="font-display text-3xl leading-[0.95] font-extrabold text-bg">
            YOU'RE THE
            <br />
            IMPOSTER
          </div>
          {role.hint ? (
            <div className="mt-2 flex flex-col items-center gap-1">
              <div className="text-[11px] font-bold uppercase tracking-widest text-bg/60">Your only clue</div>
              <div className="font-display text-xl font-extrabold text-bg">{role.hint}</div>
            </div>
          ) : null}
          {teammateName ? (
            <div className="mt-1 border border-bg/30 px-3.5 py-1.5 text-[11px] font-bold text-bg/80">
              Fellow imposter: {teammateName}
            </div>
          ) : null}
          {role.category ? (
            categoryShown ? (
              <div className="mt-1 border border-bg/30 px-3.5 py-1.5 text-[11px] font-bold text-bg/80">
                Category: {role.category}
              </div>
            ) : (
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  setCategoryShown(true);
                }}
                className="mt-1 border border-bg/30 px-3.5 py-1.5 text-[11px] font-bold text-bg/80"
              >
                Reveal category
              </span>
            )
          ) : null}
        </>
      )}

      {revealed && role.kind === 'civilian' && (
        <>
          <div className="text-[11px] font-bold uppercase tracking-widest text-primary-ink/70">
            Category: {categoryName}
          </div>
          <div className="font-display text-4xl leading-none font-extrabold break-words text-primary-ink">
            {role.word}
          </div>
        </>
      )}
    </button>
  );
}
