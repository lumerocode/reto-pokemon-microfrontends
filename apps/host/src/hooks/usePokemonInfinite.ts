import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../services/pokeapi';

export const usePokemonInfinite = () => {
  return useInfiniteQuery({
    queryKey: ['pokemons-infinite'],
    queryFn: ({ pageParam = 0, signal }) => fetchPokemonList({ pageParam, signal }),
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    initialPageParam: 0,
  });
};