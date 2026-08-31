import { Button } from '@/components/atoms/Button';
import { XIcon } from '@/components/icons';
import { ScreenLayout } from '@/components/templates/ScreenLayout';

interface HowToPlayModalProps {
  onClose: () => void;
}

const STEPS: readonly { title: string; body: string }[] = [
  {
    title: 'Everyone gets a word — one player doesn’t',
    body: 'Pass the phone around. Everyone peeks at the same secret word except the imposter, who sees nothing (or a decoy hint, if that setting’s on).',
  },
  {
    title: 'Give clues, one at a time',
    body: 'Out loud, everyone says one word or short phrase related to the secret word — including the imposter, who has to fake it convincingly.',
  },
  {
    title: 'Discuss and vote',
    body: 'Talk through who seemed off. Then either cast a secret ballot, or just decide out loud as a group.',
  },
  {
    title: 'See who won',
    body: 'Catch the imposter and the crew wins. If they slip through the vote, the imposter wins the round.',
  },
];

export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 z-50">
      <ScreenLayout
        header={
          <div className="flex items-center justify-between px-6 pb-2">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-text-dim">How to play</span>
            <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-text-dim">
              <XIcon width={16} height={16} strokeWidth={2.4} />
            </button>
          </div>
        }
        primaryAction={<Button onClick={onClose}>Got it</Button>}
      >
        <div className="px-6 pt-3 pb-4">
          <div className="flex flex-col">
            {STEPS.map((step, index) => (
              <div key={step.title} className="flex gap-3.5 border-b border-dashed border-line/25 py-3.5">
                <div className="font-display text-lg font-extrabold text-line/70 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-bold text-text">{step.title}</div>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-text-dim">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScreenLayout>
    </div>
  );
}
