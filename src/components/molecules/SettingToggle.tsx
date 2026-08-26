import { Switch } from '@/components/atoms/Switch';

interface SettingToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

export function SettingToggle({ title, description, checked, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold text-text">{title}</div>
        <div className="mt-0.5 text-[11px] text-text-dim">{description}</div>
      </div>
      <Switch checked={checked} onChange={onChange} label={title} />
    </div>
  );
}
