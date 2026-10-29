import React, { useState, useRef, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, SearchX } from 'lucide-react';
import {
  searchTools,
  getCategoryById,
  ToolDefinition,
} from '../utilities/toolRegistry';
import { CategoryIconTile } from './IconResolver';

interface SearchBarProps {
  value?: string;
  onChange?: (query: string) => void;
  placeholder?: string;
  showDropdown?: boolean;
  label?: string;
  autoFocus?: boolean;
  variant?: 'default' | 'compact' | 'hero';
  onSelectResult?: () => void;
}

const SUGGESTED_TERMS = ['Image', 'PDF', 'Word', 'QR Code', 'Percentage', 'JSON'];

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search for a tool...',
  showDropdown = true,
  label = 'Search NxK Tools catalog',
  autoFocus = false,
  variant = 'default',
  onSelectResult,
}: SearchBarProps) {
  const inputId = useId();
  const listboxId = useId();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [internalQuery, setInternalQuery] = useState(value ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const currentQuery = value !== undefined ? value : internalQuery;
  const trimmedQuery = currentQuery.trim();
  const results = trimmedQuery.length > 0 ? searchTools(trimmedQuery) : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (nextValue: string) => {
    if (value === undefined) {
      setInternalQuery(nextValue);
    }
    onChange?.(nextValue);
    setIsOpen(nextValue.trim().length > 0);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    handleInputChange('');
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (value === undefined && variant === 'compact') {
      setInternalQuery('');
    }
    inputRef.current?.blur();
    onSelectResult?.();
    navigate(tool.route);
  };

  const handleExecuteSearch = () => {
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.blur();

    // If this SearchBar is controlled on a directory page (like /tools or /search),
    // the live list is already filtered—simply close the mobile keyboard and notify.
    if (onChange) {
      onSelectResult?.();
      return;
    }

    if (!trimmedQuery) {
      onSelectResult?.();
      navigate('/tools');
      return;
    }

    onSelectResult?.();
    navigate(`/tools?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (showDropdown && isOpen && activeIndex >= 0 && activeIndex < results.length) {
      handleSelectTool(results[activeIndex]);
      return;
    }
    handleExecuteSearch();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (isOpen) {
        event.stopPropagation();
        setIsOpen(false);
        setActiveIndex(-1);
      } else if (currentQuery.length > 0) {
        event.stopPropagation();
        handleClear();
      }
      return;
    }

    if (!showDropdown || !isOpen || results.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    }
  };

  const isCompact = variant === 'compact';
  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        role="search"
        onSubmit={handleFormSubmit}
        noValidate
        className="relative flex items-center w-full"
      >
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>

        <Search
          className={`pointer-events-none absolute z-10 text-[var(--text-muted)] ${
            isCompact ? 'left-3.5 w-3.5 h-3.5' : 'left-4 w-4 h-4 sm:w-5 sm:h-5'
          }`}
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          id={inputId}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={currentQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (trimmedQuery.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          role={showDropdown ? 'combobox' : undefined}
          aria-expanded={showDropdown ? isOpen && trimmedQuery.length > 0 : undefined}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-autocomplete={showDropdown ? 'list' : undefined}
          aria-activedescendant={
            showDropdown && isOpen && activeIndex >= 0 && results[activeIndex]
              ? `${listboxId}-option-${results[activeIndex].id}`
              : undefined
          }
          className={`w-full border border-[var(--border-subtle)] bg-[var(--bg-input)] backdrop-blur-md text-[var(--text-primary)] placeholder:text-[var(--text-muted)] hover:border-[var(--border-strong)] focus:border-[var(--accent-primary)] transition-colors ${
            isCompact
              ? 'rounded-full py-2 pl-9 pr-8 text-xs min-h-[38px]'
              : isHero
              ? 'rounded-full py-3.5 sm:py-4 pl-11 sm:pl-12 pr-22 text-sm sm:text-base shadow-sm'
              : 'rounded-2xl py-3 pl-11 pr-22 text-sm shadow-xs'
          }`}
        />

        <div
          className={`absolute z-10 flex items-center gap-1 ${
            isCompact ? 'right-1.5' : 'right-2'
          }`}
        >
          {currentQuery.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search query"
              title="Clear search"
              className="inline-flex items-center justify-center rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors cursor-pointer min-h-[32px] min-w-[32px]"
            >
              <X className={isCompact ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
            </button>
          )}

          {!isCompact && (
            <button
              type="submit"
              aria-label="Perform tool search"
              title="Search tools"
              className="btn-primary-glass inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white transition-transform hover:scale-105 cursor-pointer shrink-0"
            >
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {/* Live Autocomplete Dropdown (Mobile & Desktop Friendly) */}
      {showDropdown && isOpen && trimmedQuery.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Matching tools"
          className={`liquid-glass-popover absolute top-full z-50 mt-2 max-h-[55dvh] sm:max-h-96 overflow-y-auto overscroll-contain rounded-2xl p-2 animate-enter ${
            isCompact ? 'right-0 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)]' : 'left-0 right-0'
          }`}
        >
          {results.length > 0 ? (
            <div>
              <ul className="divide-y divide-[var(--border-subtle)]">
                {results.map((tool, index) => {
                  const category = getCategoryById(tool.category);
                  const isSelected = index === activeIndex;

                  return (
                    <li
                      key={tool.id}
                      id={`${listboxId}-option-${tool.id}`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectTool(tool)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors cursor-pointer min-h-[52px] ${
                          isSelected
                            ? 'bg-[var(--accent-soft)]'
                            : 'hover:bg-[var(--bg-elevated)]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <CategoryIconTile
                            icon={tool.icon}
                            category={tool.category}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                                {tool.name}
                              </span>
                              {category && (
                                <span className="rounded-md bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-muted)]">
                                  {category.shortName}
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                              {tool.shortDescription}
                            </p>
                          </div>
                        </div>
                        <ArrowRight
                          className="w-4 h-4 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Footer Action to View Filtered Directory in All Tools */}
              <div className="mt-1.5 border-t border-[var(--border-subtle)] pt-2 px-2 flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                  {results.length} {results.length === 1 ? 'matching tool' : 'matching tools'}
                </span>
                <button
                  type="button"
                  onClick={handleExecuteSearch}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent-primary)] hover:underline py-1 cursor-pointer"
                >
                  <span>View in All Tools</span>
                  <ArrowRight className="w-3 h-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-5 text-center space-y-3">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/12 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                <SearchX className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-[var(--text-primary)]">
                  No tools matched &ldquo;{trimmedQuery}&rdquo;
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Try searching by tool name, category, or task:
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {SUGGESTED_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      handleInputChange(term);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--accent-primary)] transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                >
                  Clear search query
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
