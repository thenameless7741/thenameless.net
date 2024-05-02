'use client';

import { useEffect, useState } from 'react';

import store from '@/app/astral-kit/store';
import Interactive from './interactive';
import NonInteractive from './non-interactive';
import { PlaygroundProps as PP } from './types';

type Props = PP.Base & PP.Interactive & PP.NonInteractive;

const Playground = (p: Props) => {
  const [hydrated, setHydrated] = useState(false);
  const interactiveSettings = store((s) => s.interactive);
  const [interactive, setInteractive] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) return null;

  return interactive ?? interactiveSettings ? (
    <Interactive {...p} toggleInteractive={() => setInteractive(false)} />
  ) : (
    <NonInteractive {...p} toggleInteractive={() => setInteractive(true)} />
  );
};
export default Playground;
