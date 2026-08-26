import { CategoryTile } from '@/components/molecules/CategoryTile';
import type { Category } from '@/domain/types';

interface CategoryPickerProps {
  categories: readonly Category[];
  selectedIds: readonly string[];
  onToggleCategory: (id: string) => void;
}

export function CategoryPicker({ categories, selectedIds, onToggleCategory }: CategoryPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <CategoryTile
          key={category.id}
          name={category.name}
          wordCount={category.words.length}
          selected={selectedIds.includes(category.id)}
          onToggle={() => onToggleCategory(category.id)}
        />
      ))}
    </div>
  );
}
