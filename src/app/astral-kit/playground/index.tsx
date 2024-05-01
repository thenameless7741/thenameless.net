'use client';

import { useEffect, useState } from 'react';

import Interactive from './interactive';
import NonInteractive from './non-interactive';
import store from '@/app/astral-kit/store';

interface Props {
  system?: string;
  user?: string;
  assistant?: string | string[]; // array size relative to input
  input?: Record<string, string> | Record<string, string>[]; // array size relative to assistant
  prompt?: Message[]; // an alternative to user, assistant & input fields
  labels?: {
    system?: string;
    user?: string;
    assistant?: string;
  }; // non-interactive only
  exercise?: {
    requiredFields: ('system' | 'user')[];
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
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

  return interactive ?? interactiveSettings ? (
    <Interactive {...p} toggleInteractive={() => setInteractive(false)} />
  ) : (
    <NonInteractive {...p} toggleInteractive={() => setInteractive(true)} />
  );
};
export default Playground;
