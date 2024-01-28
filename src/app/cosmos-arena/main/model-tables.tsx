import { memo, useMemo } from 'react';

import store, { hfStore, lmsysStore } from '../store';
import { HF } from '../types';
import { fuzzySearch, keys, useDebounce } from '../utils';
import HFTable from './hf-table';
import LMSYSTable from './lmsys-table';

const ModelTables = () => {
  const arena = store((s) => s.arena);

  return arena === 'hf' ? <HFSearchContainer /> : <LMSYSSearchContainer />;
};
export default ModelTables;

const HFSearchContainer = () => {
  const filteredModels = hfStore((s) => s.filteredModels);
  const search = hfStore((s) => s.search);

  const debouncedSearch = useDebounce(search, 500);

  const searched = useMemo(() => {
    return fuzzySearch(filteredModels, debouncedSearch);
  }, [filteredModels, debouncedSearch]);

  return <HFSearch searched={searched} />;
};

const LMSYSSearchContainer = () => {
  const filteredModels = lmsysStore((s) => s.filteredModels);
  const search = lmsysStore((s) => s.search);

  const debouncedSearch = useDebounce(search, 500);

  const searched = useMemo(() => {
    return fuzzySearch(filteredModels, debouncedSearch);
  }, [filteredModels, debouncedSearch]);

  const sorted = searched.sort((m1, m2) => {
    return m2.elo - m1.elo; // always desc
  });

  return <LMSYSTable sorted={sorted} />;
};

const hfEqual = (o: HFSearchProps, n: HFSearchProps): boolean => {
  if (o.searched.length !== n.searched.length) return false;
  if (n.searched.length === 0) return true;

  for (let i = 0; i < n.searched.length; i++) {
    if (keys.hf(o.searched[i]) !== keys.hf(n.searched[i])) return false;
  }
  return true;
};

interface HFSearchProps {
  searched: HF.Model[];
}

const HFSearch = memo(({ searched }: HFSearchProps) => {
  const models = hfStore((s) => s.models);
  const headers = hfStore((s) => s.headers);
  const pins = hfStore((s) => s.pins);

  const modelByKey: { [k: string]: HF.Model } = {};
  models.forEach((m) => {
    modelByKey[keys.hf(m)] = m;
  });
  const pinned = pins.map((k) => modelByKey[k]);

  const searchedKeys = searched.map((m) => keys.hf(m));
  const pinnedKeySet = new Set(pins);
  const dedupedKeys = searchedKeys.filter((k) => !pinnedKeySet.has(k));
  const deduped = dedupedKeys.map((k) => modelByKey[k]);

  const meta = {
    total: searched.length,
  };

  return (
    <HFTable
      deduped={deduped}
      pinned={pinned}
      headers={headers}
      meta={meta}
      showPin
      sticky
    />
  );
}, hfEqual);
HFSearch.displayName = 'HFSearch';
