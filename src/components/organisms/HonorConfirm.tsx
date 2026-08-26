import { Button } from '@/components/atoms/Button';
import { DetectiveIcon } from '@/components/icons';

interface HonorConfirmProps {
  onCaught: () => void;
  onEscaped: () => void;
}

/** Fallback for groups who'd rather decide out loud than run a full vote. */
export function HonorConfirm({ onCaught, onEscaped }: HonorConfirmProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="cut flex h-16 w-16 items-center justify-center border border-line/25 bg-surface">
        <DetectiveIcon width={30} height={30} className="text-text" />
      </div>
      <div className="font-display text-xl font-extrabold text-text">Did you catch the imposter?</div>
      <p className="max-w-[240px] text-[13px] leading-relaxed text-text-dim">
        Skip the tally — just tell us how the round ended.
      </p>
      <div className="mt-1.5 flex w-full flex-col gap-2.5">
        <Button variant="primary" onClick={onCaught}>
          Yes, we caught them!
        </Button>
        <Button variant="ghost" onClick={onEscaped}>
          No, they got away
        </Button>
      </div>
    </div>
  );
}
