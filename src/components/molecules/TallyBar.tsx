import { Avatar } from '@/components/atoms/Avatar';

interface TallyBarProps {
  name: string;
  paletteIndex: number;
  votes: number;
  percent: number;
}

export function TallyBar({ name, paletteIndex, votes, percent }: TallyBarProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar name={name} paletteIndex={paletteIndex} size="sm" />
      <div className="w-[52px] shrink-0 truncate text-[13px] font-semibold text-text">{name}</div>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
      <div className="w-4 shrink-0 text-right font-display text-[13px] font-bold text-text-dim">{votes}</div>
    </div>
  );
}
