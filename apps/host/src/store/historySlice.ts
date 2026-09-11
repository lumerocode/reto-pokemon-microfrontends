import type { StateCreator } from 'zustand';
import type { AppState, HistorySlice } from './types';

export const createHistorySlice: StateCreator<AppState, [], [], HistorySlice> = (set) => ({
  history: [],
  isHistoryOpen: false,
  dismissedToastVisitKey: null,
  addPokemonToHistory: (pokemon) =>
    set((state) => {
      const existingIndex = state.history.findIndex((item) => item.id === pokemon.id);
      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        const updatedHistory = [...state.history];
        updatedHistory[existingIndex] = {
          ...updatedHistory[existingIndex],
          visitedCount: updatedHistory[existingIndex].visitedCount + 1,
          lastVisited: now,
        };
        return { history: updatedHistory };
      }

      return {
        history: [...state.history, { ...pokemon, visitedCount: 1, lastVisited: now }],
      };
    }),
  clearHistory: () => set({ history: [] }),
  openHistory: () => set({ isHistoryOpen: true }),
  closeHistory: () => set({ isHistoryOpen: false }),
  dismissToast: (visitKey) => set({ dismissedToastVisitKey: visitKey }),
});