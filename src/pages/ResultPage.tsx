import { useEffect, useState } from 'react';

import { BrandMark } from '@/components/atoms/BrandMark';
import { Button } from '@/components/atoms/Button';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { RestartIcon } from '@/components/icons';
import { TallyList } from '@/components/organisms/TallyList';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { tallyVotes } from '@/domain/gameEngine';
import { cn } from '@/lib/cn';
import { notifyReveal } from '@/lib/feedback';
import { getPlayerDisplayName, useGameStore } from '@/store/useGameStore';

function joinNames(names: readonly string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
}

export function ResultPage() {
  const [stage, setStage] = useState<'imposter' | 'full'>('imposter');

  const players = useGameStore((state) => state.players);
  const round = useGameStore((state) => state.round);
  const votes = useGameStore((state) => state.votes);
  const outcome = useGameStore((state) => state.outcome);
  const playAgain = useGameStore((state) => state.playAgain);
  const backToSetup = useGameStore((state) => state.backToSetup);

  useEffect(() => {
    notifyReveal();
  }, []);

  if (!round || !outcome) return null;

  const playerIndexById = new Map(players.map((player, index) => [player.id, index]));
  const indexOf = (id: string): number => playerIndexById.get(id) ?? -1;

  const imposterNames = outcome.imposterIds.map((id) => {
    const index = indexOf(id);
    return getPlayerDisplayName(players[index], index);
  });
  const imposterLabel = joinNames(imposterNames);
  const isPlural = imposterNames.length > 1;
  const won = outcome.imposterCaught;
  const votedOutIndex = outcome.votedOutId !== null ? indexOf(outcome.votedOutId) : -1;
  const votedOutName = votedOutIndex >= 0 ? getPlayerDisplayName(players[votedOutIndex], votedOutIndex) : 'No one';

  const tally = tallyVotes(players, votes);

  if (stage === 'imposter') {
    return (
      <ScreenLayout
        header={
          <div className="flex items-center justify-between px-6">
            <BrandMark size={26} />
            <ThemeToggle />
          </div>
        }
        primaryAction={
          <Button
            variant="danger"
            onClick={() => {
              notifyReveal();
              setStage('full');
            }}
          >
            Reveal the word
          </Button>
        }
      >
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-danger px-8 text-center">
          <div className="text-sm font-bold text-bg/60 uppercase tracking-widest">
            {isPlural ? 'The imposters were' : 'The imposter was'}
          </div>
          <div className="font-display text-4xl leading-[0.95] font-extrabold break-words text-bg sm:text-5xl">
            {imposterLabel}
          </div>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      header={
        <div className="flex items-center justify-between px-6">
          <BrandMark size={26} />
          <ThemeToggle />
        </div>
      }
      primaryAction={
        <Button onClick={playAgain}>
          <RestartIcon width={15} height={15} />
          Play again
        </Button>
      }
      secondaryAction={
        <button type="button" onClick={backToSetup} className="text-[13px] font-semibold text-text-dim">
          Back to setup
        </button>
      }
    >
      <div className="flex flex-col gap-6 px-6 pb-2 pt-5">
        <div>
          <div className={cn('text-[11px] font-bold uppercase tracking-widest', won ? 'text-accent' : 'text-danger')}>
            {won ? 'Crew wins' : 'Imposter wins'}
          </div>
          <h1 className="font-display text-3xl leading-tight font-extrabold">
            {won ? 'Busted.' : 'Smooth move.'}
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-text-dim">
            {won
              ? `${imposterLabel} ${isPlural ? 'were the imposters' : 'was the imposter'} — the crew sniffed them out.`
              : outcome.votedOutId !== null
                ? `${votedOutName} wasn't the imposter. ${imposterLabel} slipped away this round.`
                : `${imposterLabel} slipped away this round.`}
          </p>
        </div>

        <div className="border-t border-b border-dashed border-line/25 py-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-text-dim">Everyone else saw</div>
          <div className="font-display text-3xl font-extrabold text-primary">{round.secretWord}</div>
          <div className="mt-1 text-xs text-text-dim">Category: {round.categoryName}</div>
        </div>

        {votes.length > 0 ? (
          <TallyList
            tally={tally}
            nameFor={(id) => getPlayerDisplayName(players[indexOf(id)], indexOf(id))}
            paletteIndexFor={indexOf}
          />
        ) : null}
      </div>
    </ScreenLayout>
  );
}
