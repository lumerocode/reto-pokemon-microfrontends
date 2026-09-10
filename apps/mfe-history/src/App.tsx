import PokemonHistory from './components/PokemonHistory';

export function App() {
  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4">MFE History Sandbox (Port 3002)</h1>
      <PokemonHistory onSelectPokemon={(id) => alert(`Seleccionado desde Sandbox: #${id}`)} />
    </div>
  );
}

export default App;