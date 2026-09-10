import { afterEach, describe, expect, it } from 'vitest';
import { useAppStore } from './useAppStore';

afterEach(() => {
  useAppStore.setState({
    history: [],
    dismissedToastVisitKey: null,
    user: null,
    theme: 'dark',
  });
});

describe('useAppStore history', () => {
  it('adds a new Pokemon with one visit', () => {
    useAppStore.getState().addPokemonToHistory({
      id: 25,
      name: 'pikachu',
      image: 'pikachu.png',
    });

    expect(useAppStore.getState().history).toEqual([
      {
        id: 25,
        name: 'pikachu',
        image: 'pikachu.png',
        visitedCount: 1,
        lastVisited: expect.any(String),
      },
    ]);
  });

  it('increments visits for an existing Pokemon', () => {
    const pokemon = { id: 25, name: 'pikachu', image: 'pikachu.png' };

    useAppStore.getState().addPokemonToHistory(pokemon);
    useAppStore.getState().addPokemonToHistory(pokemon);

    expect(useAppStore.getState().history[0]?.visitedCount).toBe(2);
    expect(useAppStore.getState().history).toHaveLength(1);
  });

  it('clears the history', () => {
    useAppStore.getState().addPokemonToHistory({ id: 25, name: 'pikachu', image: 'pikachu.png' });
    useAppStore.getState().clearHistory();

    expect(useAppStore.getState().history).toEqual([]);
  });

  it('persists the dismissed toast visit key in the store', () => {
    useAppStore.getState().dismissToast('25:visit-key:1');

    expect(useAppStore.getState().dismissedToastVisitKey).toBe('25:visit-key:1');
  });
});
