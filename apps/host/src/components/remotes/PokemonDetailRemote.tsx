import { lazy, Suspense, useEffect } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const PokemonDetail = lazy(() => import('mfe_detail/PokemonDetail'));

interface PokemonDetailRemoteProps {
  pokemonId: number | string;
  onBack?: () => void;
}

export function PokemonDetailRemote({ pokemonId, onBack }: PokemonDetailRemoteProps) {
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const syncThemeClass = () => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    };

    syncThemeClass();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onBack?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      syncThemeClass();
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBack, theme]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pokemon-detail-title"
      className="fixed inset-0 z-50 flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-slate-950/35 p-0 backdrop-blur-md dark:bg-slate-950/45 sm:p-8"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onBack?.();
      }}
    >
      <div className="relative h-[100dvh] max-h-[100dvh] w-screen max-w-none overflow-y-auto sm:h-auto sm:max-h-[calc(100dvh-4rem)] sm:w-full sm:max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          aria-label="Close Pokemon detail"
          className="absolute right-3 top-3 z-10 rounded-xl border border-slate-200 bg-white/90 p-2 text-slate-600 shadow-sm transition-colors hover:border-indigo-400 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300"
        >
          <X className="h-5 w-5" />
        </button>
        <div onMouseDown={(event) => event.stopPropagation()}>
          <ErrorBoundary>
            <Suspense fallback={<RemoteFallback label="Loading Pokemon detail..." />}>
              <PokemonDetail pokemonId={pokemonId} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

function RemoteFallback({ label }: { label: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">{label}</div>;
}
