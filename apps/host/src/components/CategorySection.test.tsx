import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CategorySection } from './CategorySection';
import { useAppStore } from '../store/useAppStore';

const categoryResponse = {
  pokemon: [
    { pokemon: { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' } },
  ],
};

function renderCategory() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <CategorySection categoryName="electric" />
    </QueryClientProvider>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  useAppStore.setState({
    history: [],
    selectedPokemonId: null,
  });
});

describe('CategorySection', () => {
  it('renders category Pokemon returned by the API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => categoryResponse,
    }));

    renderCategory();

    expect(screen.getByText('Category: electric')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Select pikachu' })).toBeInTheDocument();
  });

  it('selects a Pokemon and records the visit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => categoryResponse,
    }));

    renderCategory();
    fireEvent.click(await screen.findByRole('button', { name: 'Select pikachu' }));

    expect(useAppStore.getState().selectedPokemonId).toBe(25);
    expect(useAppStore.getState().history[0]).toMatchObject({
      id: 25,
      name: 'pikachu',
      visitedCount: 1,
    });
  });

  it('shows an error and recovers when retry succeeds', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => categoryResponse,
      });
    vi.stubGlobal('fetch', fetchMock);

    renderCategory();

    expect(await screen.findByText('Unable to load the electric category.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Select pikachu' })).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
