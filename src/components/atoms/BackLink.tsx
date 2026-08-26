import { ArrowLeftIcon } from '@/components/icons';

interface BackLinkProps {
  label?: string;
  onClick: () => void;
}

export function BackLink({ label = 'Back', onClick }: BackLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 self-start px-6 py-1 text-sm font-semibold text-text-dim"
    >
      <ArrowLeftIcon width={15} height={15} strokeWidth={2} />
      {label}
    </button>
  );
}
