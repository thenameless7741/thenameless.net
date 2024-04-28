import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Props {
  interactive: boolean;
}

export interface State extends Props {}

const store = create<State>()(
  persist(
    (set, get) => ({
      interactive: false, // TODO: revert to true
    }),
    {
      name: 'astral-kit',
      partialize: ({ interactive }) => ({ interactive }),
    },
  ),
);
export default store;
