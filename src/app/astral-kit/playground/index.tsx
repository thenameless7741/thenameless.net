'use client';

import Interactive from './interactive';
import NonInteractive from './non-interactive';

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
  const interactive = false;

  return interactive ? <Interactive {...p} /> : <NonInteractive {...p} />;
};
export default Playground;
