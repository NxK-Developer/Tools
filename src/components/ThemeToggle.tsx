import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const actionLabel = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={actionLabel}
      title={actionLabel}
      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2 text-xs font-medium text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[36px] min-w-[36px]"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--text-primary)] shrink-0" aria-hidden="true" />
      )}
      {showLabel && <span className="px-1">{isDark ? 'Light' : 'Dark'}</span>}
    </button>
  );
}
