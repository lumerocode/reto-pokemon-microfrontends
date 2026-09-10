import React, { Suspense } from 'react';

const RemotePokemonDetail = React.lazy(() => import('mfe_detail/PokemonDetail'));
const RemotePokemonHistory = React.lazy(() => import('mfe_history/PokemonHistory'));

export function App() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-extrabold text-indigo-400">
            Host Application (Port 3000)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Verificando comunicación y renderizado dinámico de microfrontends.
          </p>
        </header>

        {/* Microfrontend: Detail */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-300">Remote: MFE Detail</h2>
          <Suspense fallback={<div className="p-4 bg-slate-800 animate-pulse rounded-xl">Cargando MFE Detail...</div>}>
            <RemotePokemonDetail pokemonId={25} />
          </Suspense>
        </section>

        {/* Microfrontend: Record */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-300">Remote: MFE Record</h2>
          <Suspense fallback={<div className="p-4 bg-slate-800 animate-pulse rounded-xl">Cargando MFE Record...</div>}>
            <RemotePokemonHistory onSelectPokemon={(id) => alert(`Pokemon seleccionado desde MFE Record: #${id}`)} />
          </Suspense>
        </section>
      </div>
    </main>
  );
}

export default App;