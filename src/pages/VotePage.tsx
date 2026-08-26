import { useState } from 'react';

import { BackLink } from '@/components/atoms/BackLink';
import { Button } from '@/components/atoms/Button';
import { HonorConfirm } from '@/components/organisms/HonorConfirm';
import { PlayerAvatarGrid } from '@/components/organisms/PlayerAvatarGrid';
import { VoteTargetList } from '@/components/organisms/VoteTargetList';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { notifyVote } from '@/lib/feedback';
import { getPlayerDisplayName, useGameStore } from '@/store/useGameStore';

type View = { kind: 'grid' } | { kind: 'detail'; voterId: string };

export function VotePage() {
  const [view, setView] = useState<View>({ kind: 'grid' });
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const players = useGameStore((state) => state.players);
  const votes = useGameStore((state) => state.votes);
  const voteView = useGameStore((state) => state.voteView);
  const setVoteView = useGameStore((state) => state.setVoteView);
  const castVote = useGameStore((state) => state.castVote);
  const finishVoting = useGameStore((state) => state.finishVoting);
  const skipVotingWithOutcome = useGameStore((state) => state.skipVotingWithOutcome);

  if (voteView === 'honor') {
    return (
      <ScreenLayout header={<BackLink label="Back to voting" onClick={() => setVoteView('ballot')} />}>
        <HonorConfirm
          onCaught={() => {
            notifyVote();
            skipVotingWithOutcome(true);
          }}
          onEscaped={() => {
            notifyVote();
            skipVotingWithOutcome(false);
          }}
        />
      </ScreenLayout>
    );
  }

  const votedVoterIds = new Set(votes.map((vote) => vote.voterId));
  const allVoted = players.every((player) => votedVoterIds.has(player.id));

  const openVoter = (voterId: string) => {
    setSelectedTargetId(votes.find((vote) => vote.voterId === voterId)?.targetId ?? null);
    setView({ kind: 'detail', voterId });
  };

  if (view.kind === 'detail') {
    const voterIndex = players.findIndex((player) => player.id === view.voterId);
    const voter = players[voterIndex];
    if (!voter) return null;

    const targets = players
      .map((player, index) => ({ player, paletteIndex: index, displayName: getPlayerDisplayName(player, index) }))
      .filter(({ player }) => player.id !== voter.id);

    const confirmLabel = selectedTargetId
      ? `Confirm Vote: ${getPlayerDisplayName(
          players[players.findIndex((player) => player.id === selectedTargetId)],
          players.findIndex((player) => player.id === selectedTargetId),
        )}`
      : 'Select a player';

    return (
      <ScreenLayout
        header={<BackLink onClick={() => setView({ kind: 'grid' })} />}
        footer={
          <Button
            variant="danger"
            disabled={!selectedTargetId}
            onClick={() => {
              if (!selectedTargetId) return;
              notifyVote();
              castVote(voter.id, selectedTargetId);
              setView({ kind: 'grid' });
            }}
          >
            {confirmLabel}
          </Button>
        }
      >
        <div className="flex h-full flex-col gap-4 px-6 pb-2 pt-3">
          <div>
            <h1 className="font-display text-xl font-extrabold">{getPlayerDisplayName(voter, voterIndex)}'s vote</h1>
            <p className="mt-1 text-[13px] text-text-dim">Who do you think is the imposter?</p>
          </div>
          <VoteTargetList targets={targets} selectedId={selectedTargetId} onSelect={setSelectedTargetId} />
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      footer={
        <div className="flex flex-col items-center gap-3">
          <Button variant="danger" onClick={finishVoting} disabled={!allVoted}>
            See Results
          </Button>
          <button type="button" onClick={() => setVoteView('honor')} className="text-[13px] font-semibold text-text-dim">
            Prefer to decide out loud? <span className="font-bold text-amber">Skip voting →</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-1 px-6 pb-2 pt-3 text-center">
        <h1 className="font-display text-2xl font-extrabold">Vote</h1>
        <p className="text-[13px] text-text-dim">Each player taps their name to cast a secret vote.</p>
        <PlayerAvatarGrid players={players} isDone={(id) => votedVoterIds.has(id)} onSelect={openVoter} />
      </div>
    </ScreenLayout>
  );
}
