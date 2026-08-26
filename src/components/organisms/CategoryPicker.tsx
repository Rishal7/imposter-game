import { Card } from '@/components/atoms/Card';
import { ChevronDownIcon, PlusIcon, TagIcon } from '@/components/icons';
import { CategoryTile } from '@/components/molecules/CategoryTile';
import type { Category } from '@/domain/types';
import { cn } from '@/lib/cn';

interface CategoryPickerProps {
  categories: readonly Category[];
  selectedIds: readonly string[];
  customCategoryIds: readonly string[];
  open: boolean;
  onToggleOpen: () => void;
  onToggleCategory: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onRemoveCategory: (id: string) => void;
  onCreateCategory: () => void;
}

export function CategoryPicker({
  categories,
  selectedIds,
  customCategoryIds,
  open,
  onToggleOpen,
  onToggleCategory,
  onSelectAll,
  onClearAll,
  onRemoveCategory,
  onCreateCategory,
}: CategoryPickerProps) {
  return (
    <Card>
      <button type="button" onClick={onToggleOpen} className="flex items-center justify-between">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-text">
            <TagIcon width={16} height={16} className="text-text-dim" />
            Categories
          </div>
          <div className="text-[13px] text-text-dim">
            {selectedIds.length} of {categories.length} selected
          </div>
        </div>
        <ChevronDownIcon
          width={16}
          height={16}
          className={cn('shrink-0 text-text-dim transition-transform', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <>
          <div className="flex gap-4">
            <button type="button" onClick={onSelectAll} className="text-xs font-bold text-amber">
              Select all
            </button>
            <button type="button" onClick={onClearAll} className="text-xs font-bold text-amber">
              Clear all
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
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
              className="flex flex-col items-center justify-center gap-1 rounded-[14px] border border-dashed border-line/35 px-3 py-3 text-text-dim"
            >
              <PlusIcon width={15} height={15} />
              <span className="text-[11px] font-bold">New pack</span>
            </button>
          </div>
        </>
      ) : null}
    </Card>
  );
}
