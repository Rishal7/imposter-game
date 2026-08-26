import { BackLink } from '@/components/atoms/BackLink';
import { Button } from '@/components/atoms/Button';
import { ChatDotsIcon, CheckIcon } from '@/components/icons';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { useGameStore } from '@/store/useGameStore';

export function DiscussPage() {
  const goToReveal = useGameStore((state) => state.goToReveal);
  const goToVote = useGameStore((state) => state.goToVote);
  const skipVoting = useGameStore((state) => state.skipVoting);

  return (
    <ScreenLayout
      header={<BackLink onClick={goToReveal} />}
      footer={
        <div className="flex flex-col items-center gap-3.5">
          <Button onClick={goToVote}>
            <CheckIcon width={16} height={16} strokeWidth={2.4} />
            Ready to Vote
          </Button>
          <button type="button" onClick={skipVoting} className="text-[13px] font-semibold text-text-dim">
            Skip voting
          </button>
        </div>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-4 px-9 text-center">
        <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[20px] border border-line/25 bg-surface shadow-[0_14px_32px_-16px_rgba(0,0,0,0.6)]">
          <ChatDotsIcon width={28} height={28} className="text-amber" />
        </div>
        <h1 className="font-display text-[28px] font-extrabold tracking-tight">Discuss</h1>
        <p className="max-w-[260px] text-sm leading-relaxed text-text-dim">
          Everyone gives one clue about their word. Talk it through and find the imposter.
        </p>
      </div>
    </ScreenLayout>
  );
}
