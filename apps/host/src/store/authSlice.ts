import type { StateCreator } from 'zustand';
import type { AppState, AuthSlice } from './types';

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
});