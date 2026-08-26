import { Button } from '@/components/atoms/Button';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 px-6 backdrop-blur-sm">
      <div className="cut cut-lg w-full max-w-sm border border-line/20 bg-surface p-5">
        <div className="font-display text-lg font-extrabold text-text">{title}</div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-text-dim">{message}</p>
        <div className="mt-5 flex flex-col gap-2.5">
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
