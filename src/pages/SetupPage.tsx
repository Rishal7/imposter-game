import { useState } from 'react';

import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/atoms/Card';
import { IconTile } from '@/components/atoms/IconTile';
import { PlayIcon, ShieldMaskIcon } from '@/components/icons';
import { CategoryPicker } from '@/components/organisms/CategoryPicker';
import { PlayerListEditor } from '@/components/organisms/PlayerListEditor';
import { SettingToggle } from '@/components/molecules/SettingToggle';
import { ScreenLayout } from '@/components/templates/ScreenLayout';
import { MAX_PLAYERS, MIN_PLAYERS } from '@/domain/gameEngine';
import { getCategories, useGameStore } from '@/store/useGameStore';

export function SetupPage() {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const players = useGameStore((state) => state.players);
  const selectedCategoryIds = useGameStore((state) => state.selectedCategoryIds);
  const settings = useGameStore((state) => state.settings);
  const addPlayer = useGameStore((state) => state.addPlayer);
  const removePlayer = useGameStore((state) => state.removePlayer);
  const renamePlayer = useGameStore((state) => state.renamePlayer);
  const toggleCategory = useGameStore((state) => state.toggleCategory);
  const selectAllCategories = useGameStore((state) => state.selectAllCategories);
  const clearAllCategories = useGameStore((state) => state.clearAllCategories);
  const toggleImposterSeesCategory = useGameStore((state) => state.toggleImposterSeesCategory);
  const toggleImposterGetsHint = useGameStore((state) => state.toggleImposterGetsHint);
  const startGame = useGameStore((state) => state.startGame);

  const categories = getCategories();
  const canStart = players.length >= MIN_PLAYERS && selectedCategoryIds.length > 0;
  const helperText =
    selectedCategoryIds.length === 0
      ? 'Pick at least one category'
      : `${players.length} players · ready to play`;

  return (
    <ScreenLayout
      header={
        <div className="flex items-center gap-2.5 px-6 pb-1.5">
          <IconTile tone="brand" size={30}>
            <ShieldMaskIcon width={15} height={15} strokeWidth={2.2} />
          </IconTile>
          <div className="font-display text-sm font-extrabold tracking-wide">IMPOSTER</div>
        </div>
      }
      footer={
        <div className="flex flex-col items-center gap-2">
          <Button onClick={startGame} disabled={!canStart}>
            <PlayIcon width={15} height={15} />
            Start Game
          </Button>
          <div className="text-xs text-text-dim">{helperText}</div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 px-6 pb-2 pt-2.5 md:grid md:grid-cols-2 md:items-start md:gap-x-4">
        <div className="text-center md:col-span-2">
          <h1 className="font-display text-[22px] font-extrabold md:text-2xl">Set up game</h1>
          <p className="mt-1 text-[13px] text-text-dim">Configure before starting</p>
        </div>

        <div className="md:col-span-2">
          <PlayerListEditor
            players={players}
            minPlayers={MIN_PLAYERS}
            maxPlayers={MAX_PLAYERS}
            onRename={renamePlayer}
            onRemove={removePlayer}
            onAdd={addPlayer}
          />
        </div>

        <CategoryPicker
          categories={categories}
          selectedIds={selectedCategoryIds}
          open={categoriesOpen}
          onToggleOpen={() => setCategoriesOpen((value) => !value)}
          onToggleCategory={toggleCategory}
          onSelectAll={selectAllCategories}
          onClearAll={clearAllCategories}
        />

        <Card>
          <SettingToggle
            title="Imposter sees category"
            description="Imposter can see the category name"
            checked={settings.imposterSeesCategory}
            onChange={toggleImposterSeesCategory}
          />
          <div className="h-px bg-line/20" />
          <SettingToggle
            title="Show imposter a hint"
            description="Imposter sees a related but different word"
            checked={settings.imposterGetsHint}
            onChange={toggleImposterGetsHint}
          />
        </Card>
      </div>
    </ScreenLayout>
  );
}
