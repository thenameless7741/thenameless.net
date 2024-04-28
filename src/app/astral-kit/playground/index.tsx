'use client';

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
  const interactive = store((s) => s.interactive);

  return interactive ? <Interactive {...p} /> : <NonInteractive {...p} />;
};
export default Playground;
