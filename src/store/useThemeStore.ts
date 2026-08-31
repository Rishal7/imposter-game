import { create } from 'zustand';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'imposter:theme';
const THEME_COLOR_BY_MODE: Record<Theme, string> = {
  dark: '#0a0d14',
  light: '#f6f7f9',
};

const readThemeAttribute = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR_BY_MODE[theme]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable — theme just won't persist across reloads.
  }
};

interface ThemeStoreState {
  theme: Theme;
  toggleTheme: () => void;
}

/**
 * `index.html`'s inline bootstrap script already resolves and sets
 * `data-theme` on `<html>` before this module ever runs, so the DOM
 * attribute — not localStorage or matchMedia again — is the source of
 * truth for which theme this session started in.
 */
export const useThemeStore = create<ThemeStoreState>((set, get) => ({
  theme: readThemeAttribute(),
  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
}));
