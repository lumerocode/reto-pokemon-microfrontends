import PokemonHistory from './components/PokemonHistory';
import type { PokemonHistoryItem } from '@reto-pokemon/shared';

export function App() {
  const history: PokemonHistoryItem[] = [];

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4">MFE History Sandbox (Port 3002)</h1>
      <PokemonHistory history={history} onSelectPokemon={(id) => alert(`Seleccionado desde Sandbox: #${id}`)} />
    </div>
  );
}

export default App;