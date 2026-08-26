import { ShareIcon, XIcon } from '@/components/icons';

interface InstallNudgeProps {
  onDismiss: () => void;
}

export function InstallNudge({ onDismiss }: InstallNudgeProps) {
  return (
    <div className="cut-sm cut mx-6 mt-4 flex items-center gap-3 border border-primary/30 bg-primary/10 px-4 py-3">
      <ShareIcon width={18} height={18} className="shrink-0 text-primary" />
      <p className="flex-1 text-[12.5px] leading-snug text-text">
        Install this app — tap <span className="font-bold text-primary">Share</span> then{' '}
        <span className="font-bold text-primary">Add to Home Screen</span>.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss install tip"
        className="shrink-0 p-1 text-text-dim"
      >
        <XIcon width={13} height={13} strokeWidth={2.4} />
      </button>
    </div>
  );
}
