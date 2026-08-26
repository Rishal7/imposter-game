import { useState } from 'react';

import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { RestartIcon } from '@/components/icons';
import { TallyList } from '@/components/organisms/TallyList';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { tallyVotes } from '@/domain/gameEngine';
import { cn } from '@/lib/cn';
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

  if (!round || !outcome) return null;

  const imposters = outcome.imposterIds.map((id) => {
    const index = players.findIndex((player) => player.id === id);
    return { index, player: players[index], name: getPlayerDisplayName(players[index], index) };
  });
  const imposterNames = joinNames(imposters.map((imposter) => imposter.name));
  const isPlural = imposters.length > 1;
  const won = outcome.imposterCaught;
  const votedOutName =
    outcome.votedOutId !== null
      ? getPlayerDisplayName(
          players[players.findIndex((player) => player.id === outcome.votedOutId)],
          players.findIndex((player) => player.id === outcome.votedOutId),
        )
      : 'No one';

  const tally = tallyVotes(players, votes);

  if (stage === 'imposter') {
    return (
      <ScreenLayout>
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="text-sm font-semibold text-text-dim">
            {isPlural ? 'The imposters were...' : 'The imposter was...'}
          </div>
          <div className="flex items-center gap-3">
            {imposters.map((imposter) => (
              <Avatar key={imposter.player.id} name={imposter.name} paletteIndex={imposter.index} size="xl" ring="red" />
            ))}
          </div>
          <div className="font-display text-2xl font-extrabold text-red">{imposterNames}</div>
          <button
            type="button"
            onClick={() => setStage('full')}
            className="mt-2 w-full max-w-[260px] rounded-2xl bg-amber px-4 py-4 font-display text-base font-bold text-amber-ink shadow-[0_12px_24px_-12px_oklch(75%_0.16_55_/_55%)]"
          >
            Reveal the Word
          </button>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      footer={
        <div className="flex flex-col items-center gap-2.5">
          <Button onClick={playAgain}>
            <RestartIcon width={15} height={15} />
            Play Again
          </Button>
          <button type="button" onClick={backToSetup} className="text-[13px] font-semibold text-text-dim">
            Back to setup
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 px-6 pb-2 pt-3">
        <div
          className={cn(
            'flex flex-col items-center gap-2.5 rounded-[22px] border p-6 text-center shadow-[0_14px_32px_-16px_rgba(0,0,0,0.6)]',
            won ? 'border-amber bg-amber/10' : 'border-red bg-red/10',
          )}
        >
          <div className="flex items-center gap-2">
            {imposters.map((imposter) => (
              <Avatar key={imposter.player.id} name={imposter.name} paletteIndex={imposter.index} size="md" />
            ))}
          </div>
          <div className="text-[13px] text-text-dim">
            {isPlural ? `Imposters were ${imposterNames}` : `Imposter was ${imposterNames}`}
          </div>
          <div className={cn('font-display text-xl font-extrabold', won ? 'text-amber' : 'text-red')}>
            {won ? 'Busted! Nice work, detectives.' : 'Smooth move, imposter.'}
          </div>
          <p className="max-w-[230px] text-[13px] text-text-dim">
            {won
              ? 'The crew sniffed them out. Civilians take the round.'
              : outcome.votedOutId !== null
                ? `${votedOutName} wasn't the imposter. They slipped away this round.`
                : `${isPlural ? 'The imposters' : 'The imposter'} slipped away this round.`}
          </p>
        </div>

        <Card>
          <div className="text-xs font-bold uppercase tracking-wide text-text-dim">The Word</div>
          <div className="flex flex-col gap-1 rounded-2xl bg-surface-2 p-4 text-center">
            <div className="text-xs text-text-dim">everyone else saw</div>
            <div className="font-display text-2xl font-extrabold text-amber">{round.secretWord}</div>
            <div className="mt-0.5 text-xs text-text-dim">Category: {round.categoryName}</div>
          </div>
        </Card>

        {votes.length > 0 ? (
          <TallyList
            tally={tally}
            nameFor={(id) => getPlayerDisplayName(players[players.findIndex((p) => p.id === id)], players.findIndex((p) => p.id === id))}
            paletteIndexFor={(id) => players.findIndex((p) => p.id === id)}
          />
        ) : null}
      </div>
    </ScreenLayout>
  );
}
