export default function PokemonDetail({ pokemonId }: { pokemonId?: string | number }) {
  return (
    <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl transition-all hover:scale-105">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-wide">MFE Detalle Activo</h3>
        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">Remote: 3001</span>
      </div>
      <p className="mt-2 text-blue-100 text-sm">
        Este componente proviene de <code className="bg-black/30 px-1.5 py-0.5 rounded">mfe-detail</code> y se está renderizando dentro del Host.
      </p>
      {pokemonId && (
        <div className="mt-4 p-2 bg-white/10 rounded-lg text-center font-mono text-sm">
          ID recibido: #{pokemonId}
        </div>
      )}
    </div>
  );
}