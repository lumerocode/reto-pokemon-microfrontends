import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';

const PokemonHistory = lazy(() => import('mfe_history/PokemonHistory'));

interface PokemonHistoryRemoteProps {
  onSelectPokemon?: (id: string) => void;
}

export function PokemonHistoryRemote({ onSelectPokemon }: PokemonHistoryRemoteProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RemoteFallback label="Loading Pokemon history..." />}>
        <PokemonHistory onSelectPokemon={onSelectPokemon} />
      </Suspense>
    </ErrorBoundary>
  );
}

function RemoteFallback({ label }: { label: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">{label}</div>;
}
