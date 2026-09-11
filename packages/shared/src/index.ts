export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
}

export interface PokemonFetchResponse {
  results: PokemonListItem[];
  next: number | null;
  count: number;
}

export interface PokemonHistoryItem {
  id: number;
  name: string;
  image: string;
  visitedCount: number;
  lastVisited: string;
}

export interface PokemonDetailResponse {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ slot: number; type: { name: string } }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  sprites: {
    front_default: string | null;
    other?: {
      dream_world?: { front_default: string | null };
      'official-artwork'?: { front_default: string | null };
    };
  };
}