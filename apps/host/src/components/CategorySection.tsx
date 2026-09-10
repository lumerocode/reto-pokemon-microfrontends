import { useQuery } from '@tanstack/react-query';
import { fetchPokemonByCategory } from '../services/pokeapi';
import { useAppStore } from '../store/useAppStore';
import { PokemonCard } from './PokemonCard';

interface CategoryProps {
  categoryName: string;
}

export function CategorySection({ categoryName }: CategoryProps) {
  const setSelectedPokemonId = useAppStore((state) => state.setSelectedPokemonId);
  const addPokemonToHistory = useAppStore((state) => state.addPokemonToHistory);
  const { data: pokemons, isLoading, isError, refetch } = useQuery({
    queryKey: ['pokemon-category', categoryName],
    queryFn: ({ signal }) => fetchPokemonByCategory(categoryName, signal),
  });

  const handleSelectPokemon = (pokemon: { id: number; name: string; image: string }) => {
    setSelectedPokemonId(pokemon.id);
    addPokemonToHistory(pokemon);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold capitalize text-slate-800 dark:text-slate-200 border-l-4 border-indigo-500 pl-3">
        Category: {categoryName}
      </h3>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-300">
          <p>Unable to load the {categoryName} category.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {pokemons?.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              variant="category"
              onSelect={handleSelectPokemon}
            />
          ))}
        </div>
      )}
    </div>
  );
}
