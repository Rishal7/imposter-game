import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { XIcon } from '@/components/icons';
import type { PlayerRole } from '@/domain/types';
import { cn } from '@/lib/cn';

import { RevealFlood } from './RevealFlood';

interface PeekModalProps {
  name: string;
  role: PlayerRole;
  categoryName: string;
  /** Called on any close. `viewed` is true once they've actually revealed the word. */
  onClose: (viewed: boolean) => void;
}

/** The reveal as a popup over the player list — no page navigation involved. */
export function PeekModal({ name, role, categoryName, onClose }: PeekModalProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-bg/92 px-6 backdrop-blur-sm">
      <div className="flex w-full max-w-sm items-center justify-between">
        <span className="font-display text-xs font-bold uppercase tracking-widest text-text-dim">{name}</span>
        <button type="button" onClick={() => onClose(revealed)} aria-label="Close" className="p-1 text-text-dim">
          <XIcon width={16} height={16} strokeWidth={2.4} />
        </button>
      </div>

      <div className="cut cut-lg h-[60dvh] max-h-[460px] w-full max-w-sm border border-line/20">
        <RevealFlood role={role} categoryName={categoryName} revealed={revealed} onReveal={() => setRevealed(true)} />
      </div>

      <div className={cn('w-full max-w-sm', !revealed && 'invisible')}>
        <Button variant="ghost" onClick={() => onClose(true)}>
          Got it — hide it
        </Button>
      </div>
    </div>
  );
}
