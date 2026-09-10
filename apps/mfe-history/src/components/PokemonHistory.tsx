export default function PokemonHistory({ onSelectPokemon }: { onSelectPokemon?: (id: string) => void }) {
  return (
    <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-wide">MFE Historial Activo</h3>
        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">Remote: 3002</span>
      </div>
      <p className="mt-2 text-emerald-100 text-sm">
        Componente federado desde <code className="bg-black/30 px-1.5 py-0.5 rounded">mfe-history</code>.
      </p>
      <button 
        onClick={() => onSelectPokemon?.('25')}
        className="mt-4 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
      >
        Probar callback (Pikachu)
      </button>
    </div>
  );
}