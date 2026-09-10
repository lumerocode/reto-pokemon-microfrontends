import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface PokemonHistoryItem {
  id: number;
  name: string;
  image: string;
  visitedCount: number;
  lastVisited: string;
}

interface AppState {
  // Theme & Layout
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Auth / User
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  // Search Modal
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Pokemon Selected
  selectedPokemonId: number | string | null;
  setSelectedPokemonId: (id: number | string | null) => void;

  // History & Persistence
  history: PokemonHistoryItem[];
  addPokemonToHistory: (pokemon: { id: number; name: string; image: string }) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme initial state
      theme: 'dark',
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: nextTheme };
        }),

      // User initial state
      user: {
        name: 'Luis Meléndez R.',
        email: 'luis@test.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luis',
      },
      login: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Search Modal State
      isSearchOpen: false,
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      // Selected Pokemon State
      selectedPokemonId: 25, // Default: Pikachu
      setSelectedPokemonId: (id) => set({ selectedPokemonId: id }),

      // History
      history: [],
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
            history: [
              ...state.history,
              { ...pokemon, visitedCount: 1, lastVisited: now },
            ],
          };
        }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'pokemon-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        history: state.history,
      }),
    }
  )
);