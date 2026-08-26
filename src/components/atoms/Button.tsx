import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'danger' | 'ghost';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-amber text-amber-ink shadow-[0_12px_24px_-12px_oklch(75%_0.16_55_/_55%)] disabled:bg-surface-2 disabled:text-text-dim disabled:shadow-none',
  danger:
    'bg-red text-amber-ink shadow-[0_12px_24px_-12px_oklch(64%_0.19_25_/_50%)] disabled:bg-surface-2 disabled:text-text-dim disabled:shadow-none',
  ghost: 'border border-line/25 bg-surface-2 text-text',
};

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-4 font-display text-base font-bold transition active:opacity-85 disabled:cursor-default',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    />
  );
}
