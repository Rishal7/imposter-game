import { useEffect, useState } from 'react';

import { BrandMark } from '@/components/atoms/BrandMark';
import { Button } from '@/components/atoms/Button';
import { ArrowRightIcon, DownloadIcon, PlayIcon, ShareIcon } from '@/components/icons';
import { InstallNudge } from '@/components/molecules/InstallNudge';
import { SettingToggle } from '@/components/molecules/SettingToggle';
import { CategoryPicker } from '@/components/organisms/CategoryPicker';
import { CustomCategoryModal } from '@/components/organisms/CustomCategoryModal';
import { PlayerListEditor } from '@/components/organisms/PlayerListEditor';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { MAX_PLAYERS, MIN_PLAYERS, MIN_PLAYERS_FOR_TWO_IMPOSTERS } from '@/domain/gameEngine';
import {
  dismissAndroidInstallNudge,
  onAndroidInstallPromptChange,
  shouldShowAndroidInstallNudge,
  triggerAndroidInstallPrompt,
} from '@/lib/androidInstallPrompt';
import { cn } from '@/lib/cn';
import { dismissIosInstallNudge, shouldShowIosInstallNudge } from '@/lib/installNudge';
import { useAllCategories, useGameStore } from '@/store/useGameStore';

const STEPS = [
  { step: 1, label: 'Crew' },
  { step: 2, label: 'Rules' },
] as const;

export function SetupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [showIosInstallNudge, setShowIosInstallNudge] = useState(() => shouldShowIosInstallNudge());
  const [showAndroidInstallNudge, setShowAndroidInstallNudge] = useState(() => shouldShowAndroidInstallNudge());

  useEffect(
    () => onAndroidInstallPromptChange(() => setShowAndroidInstallNudge(shouldShowAndroidInstallNudge())),
    [],
  );

  const players = useGameStore((state) => state.players);
  const selectedCategoryIds = useGameStore((state) => state.selectedCategoryIds);
  const customCategories = useGameStore((state) => state.customCategories);
  const settings = useGameStore((state) => state.settings);
  const addPlayer = useGameStore((state) => state.addPlayer);
  const removePlayer = useGameStore((state) => state.removePlayer);
  const renamePlayer = useGameStore((state) => state.renamePlayer);
  const toggleCategory = useGameStore((state) => state.toggleCategory);
  const addCustomCategory = useGameStore((state) => state.addCustomCategory);
  const removeCustomCategory = useGameStore((state) => state.removeCustomCategory);
  const toggleImposterSeesCategory = useGameStore((state) => state.toggleImposterSeesCategory);
  const toggleImposterGetsHint = useGameStore((state) => state.toggleImposterGetsHint);
  const toggleTwoImposters = useGameStore((state) => state.toggleTwoImposters);
  const startGame = useGameStore((state) => state.startGame);

  const categories = useAllCategories();
  const customCategoryIds = customCategories.map((category) => category.id);
  const canStart = players.length >= MIN_PLAYERS && selectedCategoryIds.length > 0;

  return (
    <ScreenLayout
      header={
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 px-6">
            <BrandMark size={30} />
            <div className="font-display text-sm font-extrabold tracking-wide">IMPOSTER</div>
          </div>
          <div className="flex px-6">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className={cn('flex-1 border-b-2 pb-2', step === s.step ? 'border-primary' : 'border-line/15')}
              >
                <span
                  className={cn(
                    'font-display text-[11px] font-bold uppercase tracking-widest',
                    step === s.step ? 'text-primary' : 'text-text-dim/60',
                  )}
                >
                  0{s.step} · {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      }
      footer={
        step === 1 ? (
          <Button onClick={() => setStep(2)}>
            Next
            <ArrowRightIcon width={15} height={15} strokeWidth={2.4} />
          </Button>
        ) : (
          <div className="flex flex-col gap-2.5">
            <Button onClick={startGame} disabled={!canStart}>
              <PlayIcon width={15} height={15} />
              Start Game
            </Button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-center text-[13px] font-semibold text-text-dim"
            >
              ← Back to crew
            </button>
          </div>
        )
      }
    >
      {showIosInstallNudge ? (
        <InstallNudge
          icon={<ShareIcon width={18} height={18} />}
          message={
            <>
              Install this app — tap <span className="font-bold text-primary">Share</span> then{' '}
              <span className="font-bold text-primary">Add to Home Screen</span>.
            </>
          }
          onDismiss={() => {
            dismissIosInstallNudge();
            setShowIosInstallNudge(false);
          }}
        />
      ) : null}

      {showAndroidInstallNudge ? (
        <InstallNudge
          icon={<DownloadIcon width={18} height={18} />}
          message="Install this app for quick access and a full-screen experience."
          actionLabel="Install"
          onAction={async () => {
            await triggerAndroidInstallPrompt();
            setShowAndroidInstallNudge(false);
          }}
          onDismiss={() => {
            dismissAndroidInstallNudge();
            setShowAndroidInstallNudge(false);
          }}
        />
      ) : null}

      {step === 1 ? (
        <div className="flex flex-col gap-1 px-6 pb-2 pt-5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-accent">Step 1</div>
          <h1 className="font-display text-3xl leading-tight font-extrabold">Who’s playing?</h1>
          <p className="mb-3 text-[13px] text-text-dim">Name everyone passing the phone tonight.</p>
          <PlayerListEditor
            players={players}
            minPlayers={MIN_PLAYERS}
            maxPlayers={MAX_PLAYERS}
            onRename={renamePlayer}
            onRemove={removePlayer}
            onAdd={addPlayer}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6 px-6 pb-2 pt-5">
          <div className="flex flex-col gap-1">
            <div className="text-[11px] font-bold uppercase tracking-widest text-accent">Step 2</div>
            <h1 className="font-display text-3xl leading-tight font-extrabold">Set the rules</h1>
            <p className="text-[13px] text-text-dim">Choose a word pack and how much rope to give the imposter.</p>
          </div>

          <CategoryPicker
            categories={categories}
            selectedIds={selectedCategoryIds}
            customCategoryIds={customCategoryIds}
            onToggleCategory={toggleCategory}
            onRemoveCategory={removeCustomCategory}
            onCreateCategory={() => setCreatingCategory(true)}
          />

          <div className="flex flex-col">
            <SettingToggle
              title="Imposter sees category"
              description="Imposter can see the category name"
              checked={settings.imposterSeesCategory}
              onChange={toggleImposterSeesCategory}
            />
            <div className="border-t border-dashed border-line/25" />
            <SettingToggle
              title="Show imposter a hint"
              description="Imposter sees a related but different word"
              checked={settings.imposterGetsHint}
              onChange={toggleImposterGetsHint}
            />
            {players.length >= MIN_PLAYERS_FOR_TWO_IMPOSTERS ? (
              <>
                <div className="border-t border-dashed border-line/25" />
                <SettingToggle
                  title="Two imposters"
                  description="A second imposter joins — they'll know who their partner is"
                  checked={settings.twoImposters}
                  onChange={toggleTwoImposters}
                />
              </>
            ) : null}
          </div>
        </div>
      )}

      {creatingCategory ? (
        <CustomCategoryModal onSave={addCustomCategory} onClose={() => setCreatingCategory(false)} />
      ) : null}
    </ScreenLayout>
  );
}
