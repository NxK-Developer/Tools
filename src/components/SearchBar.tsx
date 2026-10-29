import React, { useState, useRef, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import {
  searchTools,
  getCategoryById,
  ToolDefinition,
  ToolAvailability,
} from '../utilities/toolRegistry';
import { IconResolver } from './IconResolver';

interface SearchBarProps {
  value?: string;
  onChange?: (query: string) => void;
  placeholder?: string;
  showDropdown?: boolean;
  label?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search tools by name, category, or task (e.g., JSON, word count, PDF)...',
  showDropdown = true,
  label = 'Search NxK Tools catalog',
  autoFocus = false,
}: SearchBarProps) {
  const inputId = useId();
  const listboxId = useId();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const [internalQuery, setInternalQuery] = useState(value ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const currentQuery = value !== undefined ? value : internalQuery;
  const results = currentQuery.trim().length > 0 ? searchTools(currentQuery) : [];

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
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    setIsOpen(false);
    navigate(tool.route);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || !isOpen) {
      if (event.key === 'Enter' && currentQuery.trim().length > 0) {
        if (results.length > 0) {
          event.preventDefault();
          handleSelectTool(results[0]);
        } else if (!onChange) {
          event.preventDefault();
          navigate(`/tools?q=${encodeURIComponent(currentQuery.trim())}`);
        }
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelectTool(results[activeIndex]);
      } else if (results.length > 0) {
        handleSelectTool(results[0]);
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-4 w-5 h-5 text-[var(--text-muted)]"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="search"
          value={currentQuery}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (currentQuery.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          role={showDropdown ? 'combobox' : undefined}
          aria-expanded={showDropdown ? isOpen && currentQuery.trim().length > 0 : undefined}
          aria-controls={showDropdown ? listboxId : undefined}
          aria-autocomplete={showDropdown ? 'list' : undefined}
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] py-3.5 pl-12 pr-12 text-sm sm:text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] hover:border-[var(--border-strong)] focus:border-[var(--accent-primary)] transition-colors"
        />
        {currentQuery.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            className="absolute right-3 inline-flex items-center justify-center rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {showDropdown && isOpen && currentQuery.trim().length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Matching tools"
          style={{ boxShadow: 'var(--shadow-dropdown)' }}
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2"
        >
          {results.length > 0 ? (
            <ul className="divide-y divide-[var(--border-subtle)]">
              {results.map((tool, index) => {
                const category = getCategoryById(tool.category);
                const isSelected = index === activeIndex;
                const isAvailable = tool.availability === ToolAvailability.AVAILABLE;

                return (
                  <li key={tool.id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleSelectTool(tool)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex w-full items-center justify-between gap-4 rounded-lg px-3.5 py-3 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--bg-elevated)]'
                          : 'hover:bg-[var(--bg-elevated)]'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-canvas)] text-[var(--accent-primary)]">
                          <IconResolver icon={tool.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm text-[var(--text-primary)]">
                              {tool.name}
                            </span>
                            <span aria-hidden="true" className="text-xs text-[var(--text-muted)]">
                              ·
                            </span>
                            <span className="text-xs text-[var(--text-muted)]">
                              {category?.name ?? tool.category}
                            </span>
                            <span aria-hidden="true" className="text-xs text-[var(--text-muted)]">
                              ·
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                isAvailable
                                  ? 'text-[var(--status-available-text)]'
                                  : 'text-[var(--text-muted)]'
                              }`}
                            >
                              {isAvailable ? 'Available' : 'In development'}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                            {tool.shortDescription}
                          </p>
                        </div>
                      </div>
                      <ArrowRight
                        className="w-4 h-4 shrink-0 text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                No tools matched "{currentQuery}"
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Try searching for "image", "text", "QR", "percentage", "PDF", or "JSON".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
