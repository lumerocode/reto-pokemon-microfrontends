import { useCallback, useEffect, useRef, useState } from 'react';
import { usePokemonInfinite } from '../hooks/usePokemonInfinite';
import { useAppStore } from '../store/useAppStore';
import { fetchPokemonDetail } from '../services/pokeapi';
import type { PokemonDetailResponse } from '../services/pokeapi';
import { Search, X, Loader2 } from 'lucide-react';
import { PokemonCard } from './PokemonCard';

export function SearchModal() {
  const isSearchOpen = useAppStore((state) => state.isSearchOpen);
  const closeSearch = useAppStore((state) => state.closeSearch);
  const setSelectedPokemonId = useAppStore((state) => state.setSelectedPokemonId);
  const addPokemonToHistory = useAppStore((state) => state.addPokemonToHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [exactMatch, setExactMatch] = useState<PokemonDetailResponse | null>(null);
  const [isSearchingExact, setIsSearchingExact] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = usePokemonInfinite();

  const handleCloseSearch = useCallback(() => {
    setSearchTerm('');
    setExactMatch(null);
    setSearchError(false);
    setIsSearchingExact(false);
    closeSearch();
  }, [closeSearch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSearchOpen) handleCloseSearch();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCloseSearch, isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    triggerElementRef.current = document.activeElement as HTMLElement;
    searchInputRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      triggerElementRef.current?.focus();
      triggerElementRef.current = null;
    };
  }, [isSearchOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearchingExact(true);
      setSearchError(false);

      try {
        const normalizedTerm = searchTerm
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const result = await fetchPokemonDetail(normalizedTerm, controller.signal);
        setExactMatch(result);
      } catch {
        if (controller.signal.aborted) return;
        setExactMatch(null);
        setSearchError(true);
      } finally {
        if (!controller.signal.aborted) setIsSearchingExact(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const loadMoreElement = loadMoreRef.current;
    const resultsContainer = resultsContainerRef.current;
    if (!loadMoreElement || !resultsContainer || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: resultsContainer, rootMargin: '240px' }
    );

    observer.observe(loadMoreElement);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isSearchOpen]);

  if (!isSearchOpen) return null;

  const exactMatchImage =
    exactMatch?.sprites.other?.['official-artwork']?.front_default ?? exactMatch?.sprites.front_default;

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
    setExactMatch(null);
    setSearchError(false);

    if (!value.trim()) {
      setIsSearchingExact(false);
    }
  };

  const handleSelectPokemon = (pokemon: { id: number; name: string; image: string }) => {
    setSelectedPokemonId(pokemon.id);
    addPokemonToHistory(pokemon);
    handleCloseSearch();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md flex flex-col p-4 sm:p-8 transition-colors"
    >
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 mr-4">
          <h2 id="search-modal-title" className="sr-only">Search Pokemon</h2>
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(event) => handleSearchTermChange(event.target.value)}
            placeholder="Search Pokemon by exact name or ID (e.g. pikachu, 25)..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl pl-12 pr-5 py-3.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-lg transition-all"
            autoFocus
          />
        </div>
        <button
          type="button"
          onClick={handleCloseSearch}
          aria-label="Close search"
          className="p-3.5 sm:px-5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-2xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700/50 flex items-center space-x-2"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={resultsContainerRef} className="max-w-4xl w-full mx-auto min-h-0 flex-1 overflow-y-auto mt-6 pr-2">
        {searchTerm.trim() !== '' ? (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Exact Match Result</h3>
            {isSearchingExact && (
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-medium p-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Searching PokéAPI...</span>
              </div>
            )}

            {searchError && !isSearchingExact && (
              <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-center font-medium">
                Pokemon &quot;{searchTerm}&quot; not found.
              </div>
            )}

            {exactMatch && exactMatchImage && (
              <PokemonCard
                pokemon={{ id: exactMatch.id, name: exactMatch.name, image: exactMatchImage }}
                variant="result"
                onSelect={handleSelectPokemon}
              />
            )}
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">All Pokemon</h3>
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2 py-12 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                <span>Loading Pokemon database...</span>
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300">
                <p>Unable to load the Pokemon database.</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500"
                >
                  Try again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {data?.pages.map((page) =>
                  page.results.map((pokemon) => (
                    <PokemonCard
                      key={pokemon.id}
                      pokemon={pokemon}
                      variant="grid"
                      onSelect={handleSelectPokemon}
                    />
                  ))
                )}
              </div>
            )}

            {hasNextPage && (
              <div ref={loadMoreRef} className="flex min-h-16 items-center justify-center py-8" aria-live="polite">
                {isFetchingNextPage && (
                  <div className="flex items-center space-x-2 text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                    <span>Loading more Pokemon...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
