import type { StateCreator } from 'zustand';
import type { AppState, AuthSlice } from './types';

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set) => ({
  user: {
    name: 'Luis Meléndez R.',
    email: 'luis@pokereto.com',
    avatar: 'https://ui-avatars.com/api/?name=Luis+Melendez&background=4f46e5&color=fff&bold=true&rounded=true',
  },
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
});