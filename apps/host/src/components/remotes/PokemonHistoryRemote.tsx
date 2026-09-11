import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { useModalLock } from '../../hooks/useModalLock';
import { Loader2 } from 'lucide-react';

const PokemonHistory = lazy(() => import('mfe_history/PokemonHistory'));

interface PokemonHistoryRemoteProps {
  history: import('@reto-pokemon/shared').PokemonHistoryItem[];
  onSelectPokemon?: (id: number) => void;
  onClose?: () => void;
  onClearHistory?: () => void;
}

export function PokemonHistoryRemote({ history, onSelectPokemon, onClose, onClearHistory }: PokemonHistoryRemoteProps) {
  useModalLock(true);

  return (
    <ErrorBoundary>
      <Suspense fallback={<RemoteFallback />}>
        <PokemonHistory
          history={history}
          onSelectPokemon={onSelectPokemon}
          onClose={onClose}
          onClearHistory={onClearHistory}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

function RemoteFallback() {
  return (
    <div
      role="status"
      aria-label="Loading Pokemon history"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md dark:bg-slate-950/80"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-500" aria-hidden="true" />
        <span>Loading Pokemon history...</span>
      </div>
    </div>
  );
}

