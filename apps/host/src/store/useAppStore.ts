import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAuthSlice } from './authSlice';
import { createHistorySlice } from './historySlice';
import { createSearchSlice } from './searchSlice';
import { createSelectionSlice } from './selectionSlice';
import { createThemeSlice } from './themeSlice';
import type { AppState } from './types';

export type { AppState, User } from './types';

export const useAppStore = create<AppState>()(
  persist(
    (...args) => ({
      ...createThemeSlice(...args),
      ...createAuthSlice(...args),
      ...createSearchSlice(...args),
      ...createSelectionSlice(...args),
      ...createHistorySlice(...args),
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