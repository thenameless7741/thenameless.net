import { createContext, useContext } from 'react';
import { create, useStore } from 'zustand';
import { persist } from 'zustand/middleware';

interface Props {
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

interface PlaygroundProps {
  assistant: string[];
}

export interface PlaygroundState extends PlaygroundProps {}

export const createPlaygroundStore = (initProps: Partial<PlaygroundProps>) => {
  const defaultProps: PlaygroundProps = {
    assistant: [],
  };

  return create<PlaygroundState>((set, get) => ({
    ...defaultProps,
    ...initProps,
  }));
};

type PlaygroundStore = ReturnType<typeof createPlaygroundStore>;

export const PlaygroundContext = createContext<PlaygroundStore | null>(null);

export const usePlaygroundContext = <T>(
  selector: (s: PlaygroundState) => T,
): T => {
  const store = useContext(PlaygroundContext);
  if (!store) throw new Error('store: missing PlaygroundContext in the tree');
  return useStore(store, selector);
};
