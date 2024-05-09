import { createContext, useContext } from 'react';
import { create, useStore } from 'zustand';
import { persist } from 'zustand/middleware';

import { ToastState } from '@/ui/toast';
import { Metric } from './playground/types';

interface Props {
  interactive: boolean;
  showMetric: boolean;
}

export interface State extends Props {}

const store = create<State>()(
  persist(
    (set, get) => ({
      interactive: false, // TODO: revert to true
      showMetric: false,
    }),
    {
      name: 'astral-kit',
      partialize: ({ interactive, showMetric }) => ({
        interactive,
        showMetric,
      }),
    },
  ),
);
export default store;

interface PlaygroundProps {
  toast: ToastState<object>;
  assistant: string[];
  metrics: Metric[];
}

export interface PlaygroundState extends PlaygroundProps {}

export const createPlaygroundStore = (initProps: Partial<PlaygroundProps>) => {
  const defaultProps: PlaygroundProps = {
    toast: null!, // initialized at the component level
    assistant: [],
    metrics: [],
  };

  return create<PlaygroundState>((set, get) => ({
    ...defaultProps,
    ...initProps,
  }));
};

export type PlaygroundStore = ReturnType<typeof createPlaygroundStore>;

export const PlaygroundContext = createContext<PlaygroundStore | null>(null);

export const usePlaygroundContext = <T,>(
  selector: (s: PlaygroundState) => T,
): T => {
  const store = useContext(PlaygroundContext);
  if (!store) throw new Error('store: missing PlaygroundContext in the tree');
  return useStore(store, selector);
};
