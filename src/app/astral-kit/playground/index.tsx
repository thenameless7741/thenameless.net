'use client';

import { useEffect, useRef, useState } from 'react';

import store, {
  createPlaygroundStore,
  PlaygroundContext,
} from '@/app/astral-kit/store';
import Interactive from './interactive';
import NonInteractive from './non-interactive';
import { PlaygroundProps as PP } from './types';

type Props = PP.Base & PP.Interactive & PP.NonInteractive;

const Playground = (p: Props) => {
  const playgroundStore = useRef(createPlaygroundStore({})).current;
  const [hydrated, setHydrated] = useState(false);
  const appIa = store((s) => s.interactive);
  const [localIa, setLocalIa] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) return null;

  return (
    <PlaygroundContext.Provider value={playgroundStore}>
      {localIa ?? appIa ? (
        <Interactive {...p} toggleInteractive={() => setLocalIa(false)} />
      ) : (
        <NonInteractive {...p} toggleInteractive={() => setLocalIa(true)} />
      )}
    </PlaygroundContext.Provider>
  );
};
export default Playground;
