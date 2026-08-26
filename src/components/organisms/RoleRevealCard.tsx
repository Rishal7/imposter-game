import { useState } from 'react';

import { Avatar } from '@/components/atoms/Avatar';
import { HandTapIcon } from '@/components/icons';
import type { PlayerRole } from '@/domain/types';
import { cn } from '@/lib/cn';

const CONFETTI_BACKGROUND = [
  'radial-gradient(circle at 20% 30%, oklch(65% 0.19 300 / 45%) 0 10px, transparent 11px)',
  'radial-gradient(circle at 70% 20%, oklch(68% 0.20 340 / 40%) 0 7px, transparent 8px)',
  'radial-gradient(circle at 40% 60%, oklch(70% 0.16 250 / 40%) 0 9px, transparent 10px)',
  'radial-gradient(circle at 80% 70%, oklch(75% 0.16 55 / 40%) 0 12px, transparent 13px)',
  'radial-gradient(circle at 15% 80%, oklch(60% 0.18 180 / 35%) 0 6px, transparent 7px)',
  'radial-gradient(circle at 55% 15%, oklch(68% 0.18 300 / 35%) 0 5px, transparent 6px)',
].join(', ');

interface RoleRevealCardProps {
  role: PlayerRole;
  categoryName: string;
  playerName: string;
  paletteIndex: number;
  revealed: boolean;
  onReveal: () => void;
}

export function RoleRevealCard({ role, categoryName, playerName, paletteIndex, revealed, onReveal }: RoleRevealCardProps) {
  const [categoryShown, setCategoryShown] = useState(false);

  return (
    <button
      type="button"
      onClick={onReveal}
      disabled={revealed}
      className={cn(
        'relative flex aspect-[3/4] w-full max-w-[260px] flex-col items-center justify-center gap-3.5 overflow-hidden rounded-3xl border p-6 text-center shadow-[0_14px_32px_-16px_rgba(0,0,0,0.6)] sm:max-w-[300px] md:max-w-[340px]',
        !revealed && 'border-line/25 bg-surface',
        revealed && role.kind === 'civilian' && 'border-amber bg-amber/10',
        revealed && role.kind === 'imposter' && 'border-red bg-red/10',
      )}
    >
      {!revealed && (
        <>
          <div className="absolute inset-0 blur-lg" style={{ backgroundImage: CONFETTI_BACKGROUND }} />
          <div className="relative flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-wide text-text">
            <HandTapIcon width={14} height={14} />
            Tap to reveal
          </div>
        </>
      )}

      {revealed && role.kind === 'imposter' && (
        <>
          <Avatar name={playerName} paletteIndex={paletteIndex} size="xl" />
          <div className="font-display text-lg font-extrabold text-red">You are the Imposter!</div>
          {role.hint ? (
            <>
              <div className="-mt-1.5 text-[11px] font-bold uppercase tracking-wide text-text-dim">Your hint word</div>
              <div className="-mt-2 font-display text-xl font-extrabold text-violet">{role.hint}</div>
            </>
          ) : null}
          {role.category ? (
            categoryShown ? (
              <div className="rounded-full border border-amber bg-amber/15 px-3.5 py-1.5 text-[11px] font-bold text-amber">
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
                className="rounded-full border border-line/25 px-3.5 py-1.5 text-[11px] font-bold text-text-dim"
              >
                Show Category
              </span>
            )
          ) : null}
        </>
      )}

      {revealed && role.kind === 'civilian' && (
        <>
          <div className="text-[11px] font-bold uppercase tracking-wide text-text-dim">Category: {categoryName}</div>
          <div className="font-display text-[30px] font-extrabold text-amber">{role.word}</div>
        </>
      )}
    </button>
  );
}
