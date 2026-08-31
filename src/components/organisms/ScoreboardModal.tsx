import { useState } from 'react';

import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { XIcon } from '@/components/icons';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import type { PlayerScore, Scoreboard } from '@/domain/gameEngine';
import type { Player } from '@/domain/types';
import { getPlayerDisplayName } from '@/store/useGameStore';

interface ScoreboardModalProps {
  players: readonly Player[];
  scoreboard: Scoreboard;
  onReset: () => void;
  onClose: () => void;
}

const emptyScore = (playerId: string): PlayerScore => ({
  playerId,
  roundsPlayed: 0,
  timesImposter: 0,
  timesCaughtAsImposter: 0,
  timesEscapedAsImposter: 0,
  timesVotedCorrectly: 0,
});

/** Escaping as the imposter and voting out the real imposter are worth a point each. */
const pointsFor = (score: PlayerScore): number => score.timesEscapedAsImposter + score.timesVotedCorrectly;

export function ScoreboardModal({ players, scoreboard, onReset, onClose }: ScoreboardModalProps) {
  const [confirmingReset, setConfirmingReset] = useState(false);

  const rows = players
    .map((player, index) => {
      const score = scoreboard.get(player.id) ?? emptyScore(player.id);
      return {
        player,
        displayName: getPlayerDisplayName(player, index),
        paletteIndex: index,
        score,
        points: pointsFor(score),
      };
    })
    .sort((a, b) => b.points - a.points);

  const hasPlayed = rows.some((row) => row.score.roundsPlayed > 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-bg/96 backdrop-blur-sm lg:items-center lg:bg-[radial-gradient(ellipse_120%_100%_at_50%_-10%,_var(--color-surface),_var(--color-bg)_70%)] lg:p-8">
      <div className="flex h-dvh w-full max-w-md flex-col overflow-hidden bg-bg sm:max-w-lg md:max-w-2xl lg:h-[min(860px,90dvh)] lg:cut lg:cut-lg lg:border lg:border-line/20 lg:shadow-[0_50px_120px_-40px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <span className="font-display text-xs font-bold uppercase tracking-widest text-text-dim">Scoreboard</span>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-text-dim">
            <XIcon width={16} height={16} strokeWidth={2.4} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-3 pb-4">
          {hasPlayed ? (
            <div className="flex flex-col">
              {rows.map((row, rank) => (
                <div
                  key={row.player.id}
                  className="flex items-center gap-3 border-b border-dashed border-line/25 py-3"
                >
                  <div className="font-display text-lg font-extrabold text-line/70 tabular-nums">
                    {String(rank + 1).padStart(2, '0')}
                  </div>
                  <Avatar name={row.displayName} paletteIndex={row.paletteIndex} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-bold text-text">{row.displayName}</div>
                    <div className="text-[11px] text-text-dim">
                      {row.score.roundsPlayed} round{row.score.roundsPlayed === 1 ? '' : 's'} ·{' '}
                      {row.score.timesImposter}x imposter
                    </div>
                  </div>
                  <div className="font-display text-lg font-extrabold text-primary tabular-nums">{row.points}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-[13px] leading-relaxed text-text-dim">
              No rounds played yet tonight — points show up here after your first round ends.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5 px-6 pt-2 pb-6">
          <Button variant="ghost" onClick={() => setConfirmingReset(true)} disabled={!hasPlayed}>
            Reset scoreboard
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>

      {confirmingReset ? (
        <ConfirmDialog
          title="Reset the scoreboard?"
          message="Everyone's points for tonight will be cleared. This can't be undone."
          confirmLabel="Reset"
          onConfirm={() => {
            onReset();
            setConfirmingReset(false);
          }}
          onCancel={() => setConfirmingReset(false)}
        />
      ) : null}
    </div>
  );
}
