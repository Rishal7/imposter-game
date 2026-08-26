import { cn } from '@/lib/cn';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative h-[26px] w-[44px] shrink-0 rounded-full border transition-colors',
        checked ? 'border-primary bg-primary/15' : 'border-line/25 bg-surface-2',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 h-[19px] w-[19px] rounded-full transition-all',
          checked ? 'left-[22px] bg-primary' : 'left-0.5 bg-text-dim',
        )}
      />
    </button>
  );
}
