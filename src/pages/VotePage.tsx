import { useState } from 'react';

import { BackLink } from '@/components/atoms/BackLink';
import { BrandMark } from '@/components/atoms/BrandMark';
import { Button } from '@/components/atoms/Button';
import { BallotList } from '@/components/organisms/BallotList';
import { HonorConfirm } from '@/components/organisms/HonorConfirm';
import { PlayerTicketList } from '@/components/organisms/PlayerTicketList';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { notifyVote } from '@/lib/feedback';
import { getPlayerDisplayName, useGameStore } from '@/store/useGameStore';

type View = { kind: 'list' } | { kind: 'detail'; voterId: string };

export function VotePage() {
  const [view, setView] = useState<View>({ kind: 'list' });
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);

  const players = useGameStore((state) => state.players);
  const votes = useGameStore((state) => state.votes);
  const voteView = useGameStore((state) => state.voteView);
  const setVoteView = useGameStore((state) => state.setVoteView);
  const castVote = useGameStore((state) => state.castVote);
  const finishVoting = useGameStore((state) => state.finishVoting);
  const skipVotingWithOutcome = useGameStore((state) => state.skipVotingWithOutcome);
  const goToDiscuss = useGameStore((state) => state.goToDiscuss);

  if (voteView === 'honor') {
    return (
      <ScreenLayout
        header={
          <div className="flex items-center justify-between px-6">
            <BackLink label="Back to voting" onClick={() => setVoteView('ballot')} />
            <BrandMark size={26} />
          </div>
        }
      >
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
      ? `Mark ${getPlayerDisplayName(
          players[players.findIndex((player) => player.id === selectedTargetId)],
          players.findIndex((player) => player.id === selectedTargetId),
        )}`
      : 'Pick a name';

    return (
      <ScreenLayout
        header={
          <div className="flex items-center justify-between px-6">
            <BackLink onClick={() => setView({ kind: 'list' })} />
            <div className="font-display text-xs font-bold uppercase tracking-widest text-text-dim">
              {getPlayerDisplayName(voter, voterIndex)}
            </div>
          </div>
        }
        footer={
          <Button
            variant="danger"
            disabled={!selectedTargetId}
            onClick={() => {
              if (!selectedTargetId) return;
              notifyVote();
              castVote(voter.id, selectedTargetId);
              setView({ kind: 'list' });
            }}
          >
            {confirmLabel}
          </Button>
        }
      >
        <div className="flex h-full flex-col gap-1 px-6 pb-2 pt-5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-danger">Secret ballot</div>
          <h1 className="mb-3 font-display text-2xl font-extrabold">Who's the fake?</h1>
          <BallotList targets={targets} selectedId={selectedTargetId} onSelect={setSelectedTargetId} />
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      header={
        <div className="flex items-center justify-between px-6">
          <BackLink onClick={goToDiscuss} />
          <BrandMark size={26} />
        </div>
      }
      footer={
        <div className="flex flex-col items-center gap-3">
          <Button variant="danger" onClick={finishVoting} disabled={!allVoted}>
            See results
          </Button>
          <button type="button" onClick={() => setVoteView('honor')} className="text-[13px] font-semibold text-text-dim">
            Prefer to decide out loud? <span className="font-bold text-primary">Skip →</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-1 px-6 pb-2 pt-5">
        <div className="text-[11px] font-bold uppercase tracking-widest text-danger">Final call</div>
        <h1 className="font-display text-3xl font-extrabold">Cast it</h1>
        <p className="mb-2 text-[13px] text-text-dim">Each player taps their own name to vote in private.</p>
        <PlayerTicketList
          players={players}
          isDone={(id) => votedVoterIds.has(id)}
          doneLabel="Voted"
          pendingLabel="Tap to vote"
          onSelect={openVoter}
        />
      </div>
    </ScreenLayout>
  );
}
