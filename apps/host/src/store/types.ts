import type { PokemonHistoryItem } from '@reto-pokemon/shared';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface ThemeSlice {
  theme: 'dark' | 'light';
  hasHydrated: boolean;
  markHydrated: () => void;
  toggleTheme: () => void;
}

export interface AuthSlice {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export interface SearchSlice {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

export interface SelectionSlice {
  selectedPokemonId: number | string | null;
  setSelectedPokemonId: (id: number | string | null) => void;
}

export interface HistorySlice {
  history: PokemonHistoryItem[];
  dismissedToastVisitKey: string | null;
  addPokemonToHistory: (pokemon: { id: number; name: string; image: string }) => void;
  clearHistory: () => void;
  dismissToast: (visitKey: string) => void;
}

export type AppState = ThemeSlice & AuthSlice & SearchSlice & SelectionSlice & HistorySlice;