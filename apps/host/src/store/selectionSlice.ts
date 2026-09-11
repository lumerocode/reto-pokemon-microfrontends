import type { StateCreator } from 'zustand';
import type { AppState, SelectionSlice } from './types';

export const createSelectionSlice: StateCreator<AppState, [], [], SelectionSlice> = (set) => ({
  selectedPokemonId: null,
  setSelectedPokemonId: (id) => set({ selectedPokemonId: id }),
});