import { CategoryTile } from '@/components/molecules/CategoryTile';
import { PlusIcon } from '@/components/icons';
import type { Category } from '@/domain/types';

interface CategoryPickerProps {
  categories: readonly Category[];
  selectedIds: readonly string[];
  customCategoryIds: readonly string[];
  onToggleCategory: (id: string) => void;
  onRemoveCategory: (id: string) => void;
  onCreateCategory: () => void;
}

export function CategoryPicker({
  categories,
  selectedIds,
  customCategoryIds,
  onToggleCategory,
  onRemoveCategory,
  onCreateCategory,
}: CategoryPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <CategoryTile
          key={category.id}
          name={category.name}
          wordCount={category.words.length}
          selected={selectedIds.includes(category.id)}
          onToggle={() => onToggleCategory(category.id)}
          onRemove={customCategoryIds.includes(category.id) ? () => onRemoveCategory(category.id) : undefined}
        />
      ))}
      <button
        type="button"
        onClick={onCreateCategory}
        className="cut-sm cut flex items-center gap-1.5 border border-dashed border-line/35 px-4 py-2.5 text-[13px] font-bold text-text-dim"
      >
        <PlusIcon width={13} height={13} strokeWidth={2.4} />
        New pack
      </button>
    </div>
  );
}
