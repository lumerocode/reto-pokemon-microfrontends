import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { useModalLock } from '../../hooks/useModalLock';

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
      <Suspense fallback={null}>
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

