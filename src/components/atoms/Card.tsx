import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-[20px] border border-line/25 bg-surface p-4 shadow-[0_14px_32px_-16px_rgba(0,0,0,0.6)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
