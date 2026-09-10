const BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
}

export interface PokemonFetchResponse {
  results: PokemonListItem[];
  next: number | null; // Changed type from string | null to number | null to match offset pagination
  count: number;
}

// Helper function to extract ID from PokeAPI URL
export const getPokemonIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

// Fetch paginated Pokemon list for Infinite Scroll
export const fetchPokemonList = async ({ pageParam = 0 }: { pageParam?: number }): Promise<PokemonFetchResponse> => {
  const limit = 30;
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${pageParam}`);
  if (!res.ok) throw new Error('Failed to load Pokemon list');
  const data = await res.json();

  const results = data.results.map((item: { name: string; url: string }) => {
    const id = getPokemonIdFromUrl(item.url);
    return {
      ...item,
      id,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });

  return {
    results,
    next: data.next ? pageParam + limit : null,
    count: data.count,
  };
};

// Exact search by ID or Name
export const fetchPokemonDetail = async (idOrName: string | number) => {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName.toString().toLowerCase()}`);
  if (!res.ok) throw new Error('Pokémon not found');
  return res.json();
};