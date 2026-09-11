import type { PokemonHistoryItem } from '@reto-pokemon/shared';
import { ArrowLeft, History, Trash2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface PokemonHistoryProps {
  history: PokemonHistoryItem[];
  onSelectPokemon?: (id: number) => void;
  onClose?: () => void;
  onClearHistory?: () => void;
}

export default function PokemonHistory({
  history,
  onSelectPokemon,
  onClose,
  onClearHistory,
}: PokemonHistoryProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    triggerElementRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      triggerElementRef.current?.focus();
      triggerElementRef.current = null;
    };
  }, [onClose]);

  const sortedHistory = [...history].sort(
    (first, second) => new Date(second.lastVisited).getTime() - new Date(first.lastVisited).getTime()
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
      ref={dialogRef}
      className="fixed inset-0 z-50 flex min-h-[100dvh] items-start justify-center overflow-y-auto bg-slate-950/55 p-0 backdrop-blur-md dark:bg-slate-950/80 sm:items-center sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className="flex h-[100dvh] max-h-[100dvh] w-screen max-w-none flex-col overflow-hidden rounded-none border-0 border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:w-full sm:max-w-2xl sm:rounded-3xl sm:border">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <History className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="history-modal-title" className="text-lg font-extrabold text-slate-900 dark:text-white sm:text-xl">
                Recently viewed
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Your latest Pokemon discoveries</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            ref={closeButtonRef}
            aria-label="Close history"
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {sortedHistory.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 text-center dark:border-slate-700">
              <History className="h-10 w-10 text-slate-300 dark:text-slate-600" aria-hidden="true" />
              <p className="mt-3 font-semibold text-slate-700 dark:text-slate-200">No recently viewed Pokemon</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Open a Pokemon detail to see it here.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {sortedHistory.map((pokemon) => (
                <li key={pokemon.id}>
                  <button
                    type="button"
                    onClick={() => onSelectPokemon?.(pokemon.id)}
                    className="flex w-full items-center gap-4 bg-white px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/70 sm:px-5"
                  >
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="h-16 w-16 shrink-0 object-contain"
                      loading="lazy"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold capitalize text-slate-900 dark:text-white">{pokemon.name}</span>
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        Seen {pokemon.visitedCount} {pokemon.visitedCount === 1 ? 'time' : 'times'}
                      </span>
                    </span>
                    <span className="font-mono text-xs text-slate-400 dark:text-slate-500">#{String(pokemon.id).padStart(3, '0')}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear history</span>
          </button>
        </footer>
      </div>
    </div>
  );
}