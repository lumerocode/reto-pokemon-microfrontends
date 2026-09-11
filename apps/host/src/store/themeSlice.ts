import type { StateCreator } from 'zustand';
import type { AppState, ThemeSlice } from './types';

export const createThemeSlice: StateCreator<AppState, [], [], ThemeSlice> = (set) => ({
  theme: 'dark',
  hasHydrated: false,
  markHydrated: () => set({ hasHydrated: true }),
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';

      document.documentElement.classList.toggle('dark', nextTheme === 'dark');

      return { theme: nextTheme };
    }),
});