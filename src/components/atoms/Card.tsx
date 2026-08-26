import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={cn('cut flex flex-col gap-3 border border-line/20 bg-surface p-4', className)}>{children}</div>;
}
