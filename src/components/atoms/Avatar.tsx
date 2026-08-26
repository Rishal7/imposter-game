import type { ReactNode } from 'react';

import { getAvatarGradient } from '@/lib/avatarPalette';
import { cn } from '@/lib/cn';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg sm:h-16 sm:w-16 sm:text-xl md:h-[72px] md:w-[72px] md:text-2xl',
  xl: 'h-16 w-16 text-2xl md:h-20 md:w-20 md:text-3xl',
};

interface AvatarProps {
  name: string;
  paletteIndex: number;
  size?: AvatarSize;
  ring?: 'red' | 'none';
  badge?: ReactNode;
  className?: string;
}

export function Avatar({ name, paletteIndex, size = 'md', ring = 'none', badge, className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-display font-extrabold text-white',
          SIZE_CLASSES[size],
          ring === 'red' && 'shadow-[0_0_0_4px_oklch(64%_0.19_25_/_16%)] ring-3 ring-red',
        )}
        style={{ backgroundImage: getAvatarGradient(paletteIndex) }}
      >
        {initial}
      </div>
      {badge}
    </div>
  );
}
