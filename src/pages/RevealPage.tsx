import { useState } from 'react';

import { BackLink } from '@/components/atoms/BackLink';
import { Button } from '@/components/atoms/Button';
import { PlayerAvatarGrid } from '@/components/organisms/PlayerAvatarGrid';
import { RoleRevealCard } from '@/components/organisms/RoleRevealCard';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { cn } from '@/lib/cn';
import { getPlayerDisplayName, useGameStore } from '@/store/useGameStore';

type View = { kind: 'grid' } | { kind: 'detail'; playerId: string };

export function RevealPage() {
  const [view, setView] = useState<View>({ kind: 'grid' });
  const [revealed, setRevealed] = useState(false);

  const players = useGameStore((state) => state.players);
  const round = useGameStore((state) => state.round);
  const revealedPlayerIds = useGameStore((state) => state.revealedPlayerIds);
  const markRevealed = useGameStore((state) => state.markRevealed);
  const goToDiscuss = useGameStore((state) => state.goToDiscuss);

  if (!round) return null;

  const allRevealed = players.every((player) => revealedPlayerIds.has(player.id));

  const openPlayer = (playerId: string) => {
    setRevealed(false);
    setView({ kind: 'detail', playerId });
  };

  const handleGotIt = (playerId: string) => {
    markRevealed(playerId);
    setView({ kind: 'grid' });
  };

  const nameForId = (playerId: string): string | null => {
    const index = players.findIndex((player) => player.id === playerId);
    return index >= 0 ? getPlayerDisplayName(players[index], index) : null;
  };

  if (view.kind === 'detail') {
    const index = players.findIndex((player) => player.id === view.playerId);
    const player = players[index];
    const role = round.roles.get(view.playerId);
    if (!player || !role) return null;
    const name = getPlayerDisplayName(player, index);
    const teammateName = role.kind === 'imposter' && role.teammateId ? nameForId(role.teammateId) : null;

    return (
      <ScreenLayout
        header={<BackLink onClick={() => setView({ kind: 'grid' })} />}
        footer={
          <div className={cn(!revealed && 'invisible')}>
            <Button variant="ghost" onClick={() => handleGotIt(player.id)}>
              Got it!
            </Button>
          </div>
        }
      >
        <div className="flex h-full flex-col items-center gap-4 px-7 pb-2 pt-1 text-center">
          <div className="font-display text-lg font-bold text-text-dim">
            The word for <span className="text-text">{name}</span>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <RoleRevealCard
              key={player.id}
              role={role}
              categoryName={round.categoryName}
              playerName={name}
              paletteIndex={index}
              teammateName={teammateName}
              revealed={revealed}
              onReveal={() => setRevealed(true)}
            />
          </div>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      footer={
        <div className="flex flex-col items-center gap-2">
          <Button onClick={goToDiscuss} disabled={!allRevealed}>
            Continue to Discussion →
          </Button>
          <div className="text-xs text-text-dim">
            {revealedPlayerIds.size} of {players.length} revealed
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-1 px-6 pb-2 pt-3 text-center">
        <h1 className="font-display text-2xl font-extrabold">Players</h1>
        <p className="text-[13px] leading-relaxed text-text-dim">
          Tap your name to reveal your word, then pass the device to the next player.
        </p>
        <PlayerAvatarGrid players={players} isDone={(id) => revealedPlayerIds.has(id)} onSelect={openPlayer} />
      </div>
    </ScreenLayout>
  );
}
