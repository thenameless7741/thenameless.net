'use client';

import { useEffect, useRef, useState } from 'react';

import store, {
  createPlaygroundStore,
  PlaygroundContext,
  PlaygroundStore,
} from '@/app/astral-kit/store';
import { ToastProvider } from '@/ui/toast';
import Interactive from './interactive';
import NonInteractive from './non-interactive';
import { PlaygroundProps as PP } from './types';

type Props = PP.Base & PP.Interactive & PP.NonInteractive;

const Playground = (p: Props) => {
  const playgroundStore = useRef<PlaygroundStore>(null!);
  const [hydrated, setHydrated] = useState(false);
  const appIa = store((s) => s.interactive);
  const [localIa, setLocalIa] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) return null;

  return (
    <ToastProvider>
      {(toast) => {
        playgroundStore.current = createPlaygroundStore({ toast });

        return (
          <PlaygroundContext.Provider value={playgroundStore.current}>
            {localIa ?? appIa ? (
              <Interactive {...p} toggleInteractive={() => setLocalIa(false)} />
            ) : (
              <NonInteractive
                {...p}
                toggleInteractive={() => setLocalIa(true)}
              />
            )}
          </PlaygroundContext.Provider>
        );
      }}
    </ToastProvider>
  );
};
export default Playground;
