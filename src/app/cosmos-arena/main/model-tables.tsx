import { memo, useMemo } from 'react';

import store, { hfStore } from '../store';
import { HF } from '../types';
import { fuzzySearch, key, useDebounce } from '../utils';
import HFTable from './hf-table';
import LMSYSTable from './lmsys-table';

const ModelTables = () => {
  const arena = store((s) => s.arena);

  return arena === 'hf' ? <HFSearchContainer /> : <LMSYSTable />;
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

const hfEqual = (o: HFProps, n: HFProps): boolean => {
  if (o.searched.length !== n.searched.length) return false;
  if (n.searched.length === 0) return true;

  for (let i = 0; i < n.searched.length; i++) {
    if (key(o.searched[i]) !== key(n.searched[i])) return false;
  }
  return true;
};

interface HFProps {
  searched: HF.Model[];
}

const HFSearch = memo(({ searched }: HFProps) => {
  const models = hfStore((s) => s.models);
  const headers = hfStore((s) => s.headers);
  const pins = hfStore((s) => s.pins);

  const modelByKey: { [k: string]: HF.Model } = {};
  models.forEach((m) => {
    modelByKey[key(m)] = m;
  });
  const pinned = pins.map((k) => modelByKey[k]);

  const searchedKeys = searched.map((m) => key(m));
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
