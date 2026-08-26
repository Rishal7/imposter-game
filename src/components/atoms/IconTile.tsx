import type { ReactNode } from 'react';

interface IconTileProps {
  children: ReactNode;
  size?: number;
  className?: string;
}

export function IconTile({ children, size = 44, className }: IconTileProps) {
  return (
    <div
      className={className ?? 'cut flex shrink-0 items-center justify-center text-primary-ink'}
      style={{
        width: size,
        height: size,
        backgroundImage: 'linear-gradient(135deg, var(--color-primary), var(--color-danger))',
      }}
    >
      {children}
    </div>
  );
}
