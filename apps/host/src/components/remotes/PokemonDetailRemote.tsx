import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';

const PokemonDetail = lazy(() => import('mfe_detail/PokemonDetail'));

interface PokemonDetailRemoteProps {
  pokemonId: number | string;
  onBack?: () => void;
}

export function PokemonDetailRemote({ pokemonId, onBack }: PokemonDetailRemoteProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RemoteFallback label="Loading Pokemon detail..." />}>
        <PokemonDetail pokemonId={pokemonId} onBack={onBack} />
      </Suspense>
    </ErrorBoundary>
  );
}

function RemoteFallback({ label }: { label: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">{label}</div>;
}
