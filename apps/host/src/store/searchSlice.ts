import type { StateCreator } from 'zustand';
import type { AppState, SearchSlice } from './types';

export const createSearchSlice: StateCreator<AppState, [], [], SearchSlice> = (set) => ({
  isSearchOpen: false,
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
});