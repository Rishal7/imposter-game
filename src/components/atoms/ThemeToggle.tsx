import { MoonIcon, SunIcon } from '@/components/icons';
import { useThemeStore } from '@/store/useThemeStore';

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="p-1 text-text-dim"
    >
      {theme === 'dark' ? <SunIcon width={20} height={20} /> : <MoonIcon width={20} height={20} />}
    </button>
  );
}
