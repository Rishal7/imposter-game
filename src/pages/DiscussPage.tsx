import { BackLink } from '@/components/atoms/BackLink';
import { BrandMark } from '@/components/atoms/BrandMark';
import { Button } from '@/components/atoms/Button';
import { CheckIcon } from '@/components/icons';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { useGameStore } from '@/store/useGameStore';

export function DiscussPage() {
  const goToReveal = useGameStore((state) => state.goToReveal);
  const goToVote = useGameStore((state) => state.goToVote);
  const skipVoting = useGameStore((state) => state.skipVoting);

  return (
    <ScreenLayout
      header={
        <div className="flex items-center justify-between px-6">
          <BackLink onClick={goToReveal} />
          <BrandMark size={26} />
        </div>
      }
      footer={
        <div className="flex flex-col items-center gap-3.5">
          <Button onClick={goToVote}>
            <CheckIcon width={16} height={16} strokeWidth={2.4} />
            Ready to vote
          </Button>
          <button type="button" onClick={skipVoting} className="text-[13px] font-semibold text-text-dim">
            Skip voting
          </button>
        </div>
      }
    >
      <div className="flex h-full flex-col items-center justify-center gap-6 px-9 text-center">
        <div className="cut-lg cut -rotate-3 border-4 border-accent px-7 py-3">
          <span className="font-display text-2xl font-extrabold tracking-widest text-accent uppercase">Discuss</span>
        </div>
        <p className="max-w-[250px] text-sm leading-relaxed text-text-dim">
          Everyone gives one clue about their word — out loud, one at a time. Listen for whoever's guessing.
        </p>
      </div>
    </ScreenLayout>
  );
}
