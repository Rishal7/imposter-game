import type { ComponentPropsWithRef } from 'react';

import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'danger' | 'ghost';

interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-ink shadow-[0_14px_28px_-14px_oklch(from_var(--color-primary)_l_c_h_/_0.4)] disabled:bg-surface-2 disabled:text-text-dim disabled:shadow-none',
  danger:
    'bg-danger text-primary-ink shadow-[0_14px_28px_-14px_oklch(from_var(--color-danger)_l_c_h_/_0.4)] disabled:bg-surface-2 disabled:text-text-dim disabled:shadow-none',
  ghost: 'bg-transparent text-text ring-1 ring-inset ring-line/40',
};

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'cut flex w-full items-center justify-center gap-2 px-5 py-4 font-display text-sm font-bold uppercase tracking-wide transition active:translate-y-0.5 disabled:cursor-default disabled:active:translate-y-0',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    />
  );
}
