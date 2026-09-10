import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchPokemonByCategory, fetchPokemonDetail, fetchPokemonList, getPokemonIdFromUrl } from './pokeapi';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('pokeapi service', () => {
  it('extracts a Pokemon id from an API URL', () => {
    expect(getPokemonIdFromUrl('https://pokeapi.co/api/v2/pokemon/25/')).toBe(25);
  });

  it('maps list results to display items and calculates the next offset', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        count: 1302,
        next: 'https://pokeapi.co/api/v2/pokemon?offset=30&limit=30',
        results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
      }),
    }));

    await expect(fetchPokemonList({ pageParam: 0 })).resolves.toMatchObject({
      count: 1302,
      next: 30,
      results: [{ id: 25, name: 'pikachu' }],
    });
  });

  it('returns null next offset on the last page', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ count: 1, next: null, results: [] }),
    }));

    await expect(fetchPokemonList({ pageParam: 30 })).resolves.toMatchObject({ next: null });
  });

  it('passes an abort signal to detail requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 25, name: 'pikachu', sprites: { front_default: 'pikachu.png' } }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const controller = new AbortController();

    await fetchPokemonDetail('pikachu', controller.signal);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/pikachu',
      { signal: controller.signal }
    );
  });

  it('throws when the API responds with an error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    await expect(fetchPokemonByCategory('unknown')).rejects.toThrow('PokéAPI request failed: 404');
  });
});
