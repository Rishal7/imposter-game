import type { ReactNode } from 'react';

import { XIcon } from '@/components/icons';

interface InstallNudgeProps {
  icon: ReactNode;
  message: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
}

export function InstallNudge({ icon, message, actionLabel, onAction, onDismiss }: InstallNudgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber/30 bg-amber/10 px-4 py-3">
      <span className="shrink-0 text-amber">{icon}</span>
      <p className="flex-1 text-[12.5px] leading-snug text-text">{message}</p>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction} className="shrink-0 text-[12px] font-bold text-amber">
          {actionLabel}
        </button>
      ) : null}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss install tip"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-text-dim"
      >
        <XIcon width={13} height={13} strokeWidth={2.4} />
      </button>
    </div>
  );
}
