import { useState } from 'react';

import { BackLink } from '@/components/atoms/BackLink';
import { BrandMark } from '@/components/atoms/BrandMark';
import { Button } from '@/components/atoms/Button';
import { PeekModal } from '@/components/organisms/PeekModal';
import { PlayerTicketList } from '@/components/organisms/PlayerTicketList';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { getPlayerDisplayName, useGameStore } from '@/store/useGameStore';

export function RevealPage() {
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  const players = useGameStore((state) => state.players);
  const round = useGameStore((state) => state.round);
  const revealedPlayerIds = useGameStore((state) => state.revealedPlayerIds);
  const markRevealed = useGameStore((state) => state.markRevealed);
  const goToDiscuss = useGameStore((state) => state.goToDiscuss);
  const backToSetup = useGameStore((state) => state.backToSetup);

  if (!round) return null;

  const allRevealed = players.every((player) => revealedPlayerIds.has(player.id));

  const nameForId = (playerId: string): string | null => {
    const index = players.findIndex((player) => player.id === playerId);
    return index >= 0 ? getPlayerDisplayName(players[index], index) : null;
  };

  const activeIndex = activePlayerId ? players.findIndex((player) => player.id === activePlayerId) : -1;
  const activePlayer = activeIndex >= 0 ? players[activeIndex] : null;
  const activeRole = activePlayerId ? round.roles.get(activePlayerId) : undefined;
  const teammateName = activeRole?.kind === 'imposter' && activeRole.teammateId ? nameForId(activeRole.teammateId) : null;

  return (
    <ScreenLayout
      header={
        <div className="flex items-center justify-between px-6">
          <BackLink label="Back to setup" onClick={backToSetup} />
          <BrandMark size={26} />
        </div>
      }
      primaryAction={
        <Button onClick={goToDiscuss} disabled={!allRevealed}>
          Continue to discussion
        </Button>
      }
      secondaryAction={
        <div className="text-xs text-text-dim">
          {revealedPlayerIds.size} of {players.length} peeked
        </div>
      }
    >
      <div className="flex flex-col gap-1 px-6 pb-2 pt-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-accent">Pass it around</div>
        <h1 className="font-display text-3xl font-extrabold">One by one</h1>
        <p className="mb-2 text-[13px] leading-relaxed text-text-dim">
          Tap your name, peek at your word, then hand the device to the next player.
        </p>
        <PlayerTicketList
          players={players}
          isDone={(id) => revealedPlayerIds.has(id)}
          doneLabel="Peeked"
          pendingLabel="Tap to peek"
          onSelect={setActivePlayerId}
          lockWhenDone
        />
      </div>

      {activePlayer && activeRole ? (
        <PeekModal
          key={activePlayer.id}
          name={getPlayerDisplayName(activePlayer, activeIndex)}
          role={activeRole}
          categoryName={round.categoryName}
          teammateName={teammateName}
          onClose={(viewed) => {
            if (viewed) markRevealed(activePlayer.id);
            setActivePlayerId(null);
          }}
        />
      ) : null}
    </ScreenLayout>
  );
}
