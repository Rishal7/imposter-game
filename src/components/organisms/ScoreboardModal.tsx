import { useState } from 'react';

import { Avatar } from '@/components/atoms/Avatar';
import { Button } from '@/components/atoms/Button';
import { XIcon } from '@/components/icons';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
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
    <div className="fixed inset-0 z-50">
      <ScreenLayout
        header={
          <div className="flex items-center justify-between px-6 pb-2">
            <span className="font-display text-xs font-bold uppercase tracking-widest text-text-dim">Scoreboard</span>
            <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-text-dim">
              <XIcon width={16} height={16} strokeWidth={2.4} />
            </button>
          </div>
        }
        primaryAction={<Button onClick={onClose}>Close</Button>}
        secondaryAction={
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            disabled={!hasPlayed}
            className="text-[13px] font-semibold text-text-dim disabled:opacity-40"
          >
            Reset scoreboard
          </button>
        }
      >
        <div className="px-6 pt-3 pb-4">
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
      </ScreenLayout>

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
