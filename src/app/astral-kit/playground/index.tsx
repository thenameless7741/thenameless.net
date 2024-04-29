'use client';

import { useEffect, useState } from 'react';

import Interactive from './interactive';
import NonInteractive from './non-interactive';
import store from '@/app/astral-kit/store';

interface Props {
  system?: string;
  user?: string;
  assistant?: string | string[]; // array size relative to input
  labels?: {
    system?: string;
    user?: string;
    assistant?: string;
  };
  input?: Record<string, string> | Record<string, string>[]; // array size relative to assistant
}

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

  console.log(interactiveSettings, interactive ?? interactiveSettings);

  return interactive ?? interactiveSettings ? (
    <Interactive {...p} toggleInteractive={() => setInteractive(false)} />
  ) : (
    <NonInteractive {...p} toggleInteractive={() => setInteractive(true)} />
  );
};
export default Playground;
