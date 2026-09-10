import PokemonDetail from './components/PokemonDetail';

export function App() {
  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4">MFE Detail Sandbox (Port 3001)</h1>
      <PokemonDetail pokemonId={25} />
    </div>
  );
}

export default App;