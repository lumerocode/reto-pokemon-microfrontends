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
  hasHydrated: boolean;
  markHydrated: () => void;
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
  dismissedToastVisitKey: string | null;
  addPokemonToHistory: (pokemon: { id: number; name: string; image: string }) => void;
  clearHistory: () => void;
  dismissToast: (visitKey: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme initial state
      theme: 'dark',
      hasHydrated: false,
      markHydrated: () => set({ hasHydrated: true }),
      toggleTheme: () =>
        set((state) => {
          const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
          
          // Helper to sync document root element class
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
        email: 'luis@pokereto.com',
        avatar: 'https://ui-avatars.com/api/?name=Luis+Melendez&background=4f46e5&color=fff&bold=true&rounded=true',
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
            history: [
              ...state.history,
              { ...pokemon, visitedCount: 1, lastVisited: now },
            ],
          };
        }),
      clearHistory: () => set({ history: [] }),
      dismissToast: (visitKey) => set({ dismissedToastVisitKey: visitKey }),
    }),
    {
      name: 'pokemon-app-storage',
      version: 1,
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        history: state.history,
        dismissedToastVisitKey: state.dismissedToastVisitKey,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppState>;

        return {
          ...state,
          dismissedToastVisitKey: state.dismissedToastVisitKey ?? null,
        } as AppState;
      },
      // Sync document theme immediately after Zustand restores saved localStorage state
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        state?.markHydrated();
      },
    }
  )
);