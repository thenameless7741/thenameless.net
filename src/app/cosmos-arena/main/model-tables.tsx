import { memo, useMemo } from 'react';

import { hfStore } from '../store';
import { HF } from '../types';
import { fuzzySearch, key, useDebounce } from '../utils';
import ModelTable from './model-table';

const ModelTables = () => {
  const filteredModels = hfStore((s) => s.filteredModels);
  const search = hfStore((s) => s.search);

  const debouncedSearch = useDebounce(search, 500);

  const searched = useMemo(() => {
    return fuzzySearch(filteredModels, debouncedSearch);
  }, [filteredModels, debouncedSearch]);

  return <Average searched={searched} />;
};
export default ModelTables;

interface AverageProps {
  searched: HF.Model[];
}

const equal = (o: AverageProps, n: AverageProps): boolean => {
  if (o.searched.length !== n.searched.length) return false;
  if (n.searched.length === 0) return true;

  for (let i = 0; i < n.searched.length; i++) {
    if (key(o.searched[i]) !== key(n.searched[i])) return false;
  }
  return true;
};

const Average = memo(({ searched }: AverageProps) => {
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
    <ModelTable
      deduped={deduped}
      pinned={pinned}
      headers={headers}
      meta={meta}
      showPin
      sticky
    />
  );
}, equal);
Average.displayName = 'Average';
