export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'nxk-theme';

export function resolveInitialTheme(
  savedTheme: string | null | undefined,
  prefersDark: boolean
): ThemeMode {
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return prefersDark ? 'dark' : 'light';
}

export function getBrowserInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    saved = null;
  }
  const prefersDark =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  return resolveInitialTheme(saved, prefersDark);
}

export function applyThemeToDocument(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
