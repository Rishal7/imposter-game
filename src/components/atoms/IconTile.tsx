import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface IconTileProps {
  children: ReactNode;
  tone?: 'brand' | 'neutral';
  size?: number;
  className?: string;
}

export function IconTile({ children, tone = 'neutral', size = 44, className }: IconTileProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-2xl',
        tone === 'brand' && 'text-amber-ink',
        tone === 'neutral' && 'border border-line/25 bg-surface text-amber shadow-[0_14px_32px_-16px_rgba(0,0,0,0.6)]',
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundImage: tone === 'brand' ? 'linear-gradient(135deg, var(--color-amber), var(--color-red))' : undefined,
      }}
    >
      {children}
    </div>
  );
}
