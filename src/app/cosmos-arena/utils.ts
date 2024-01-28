import uFuzzy from '@leeoniya/ufuzzy';
import { useEffect, useState } from 'react';

import { HF, LMSYS } from './types';

const u = new uFuzzy();

interface HasName {
  name: string;
}

export const fuzzySearch = <T extends HasName>(models: T[], needle: string) => {
  if (!needle.trim()) return models;

  const haystack = models.map((m) => m.name);

  const idxs = u.filter(haystack, needle);
  if (idxs === null || idxs.length === 0) return [];

  const info = u.info(idxs, haystack, needle);
  const order = u.sort(info, haystack, needle);
  return order.map((i) => models[info.idx[order[i]]]);
};

export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedValue === value) return;
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, delay]);

  return debouncedValue;
};

export const keys = {
  hf: (m: HF.Model) => `${m.name}__${m.type}__${m.precision}`,
  lmsys: (m: LMSYS.Model) => m.name,
};
