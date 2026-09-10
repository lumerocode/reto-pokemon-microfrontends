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

export interface PokemonDetailResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
}

interface PokemonApiListResponse {
  count: number;
  next: string | null;
  results: Array<{ name: string; url: string }>;
}

interface PokemonTypeResponse {
  pokemon: Array<{ pokemon: { name: string; url: string } }>;
}

const apiFetch = async <T>(url: string, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`PokéAPI request failed: ${response.status}`);
  return response.json() as Promise<T>;
};

// Helper function to extract ID from PokeAPI URL
export const getPokemonIdFromUrl = (url: string): number => {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
};

// Fetch paginated Pokemon list for Infinite Scroll
export const fetchPokemonList = async ({ pageParam = 0, signal }: { pageParam?: number; signal?: AbortSignal }): Promise<PokemonFetchResponse> => {
  const limit = 30;
  const data = await apiFetch<PokemonApiListResponse>(`${BASE_URL}/pokemon?limit=${limit}&offset=${pageParam}`, signal);

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
export const fetchPokemonDetail = async (
  idOrName: string | number,
  signal?: AbortSignal
): Promise<PokemonDetailResponse> => {
  return apiFetch<PokemonDetailResponse>(`${BASE_URL}/pokemon/${idOrName.toString().toLowerCase()}`, signal);
};

// Fetch top 10 Pokemon by Type (Category)
export const fetchPokemonByCategory = async (type: string, signal?: AbortSignal): Promise<PokemonListItem[]> => {
  const data = await apiFetch<PokemonTypeResponse>(`${BASE_URL}/type/${type.toLowerCase()}`, signal);

  // Extract first 10 pokemons for the row
  const top10 = data.pokemon.slice(0, 10);

  return top10.map((entry: { pokemon: { name: string; url: string } }) => {
    const id = getPokemonIdFromUrl(entry.pokemon.url);
    return {
      name: entry.pokemon.name,
      url: entry.pokemon.url,
      id,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };
  });
};