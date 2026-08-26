import { DiscussPage } from '@/pages/DiscussPage';
import { RevealPage } from '@/pages/RevealPage';
import { ResultPage } from '@/pages/ResultPage';
import { SetupPage } from '@/pages/SetupPage';
import { VotePage } from '@/pages/VotePage';
import { useGameStore } from '@/store/useGameStore';

export function App() {
  const phase = useGameStore((state) => state.phase);

  switch (phase) {
    case 'setup':
      return <SetupPage />;
    case 'reveal':
      return <RevealPage />;
    case 'discuss':
      return <DiscussPage />;
    case 'vote':
      return <VotePage />;
    case 'result':
      return <ResultPage />;
  }
}
