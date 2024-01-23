import { memo, useMemo } from 'react';

import store from '../store';
import type { Model, Sortable } from '../types';
import { fuzzySearch, key, useDebounce } from '../utils';
import ModelTable from './model-table';

const ModelTables = () => {
  const filteredModels = store((s) => s.filteredModels);
  const search = store((s) => s.search);

  const debouncedSearch = useDebounce(search, 500);

  const searched = useMemo(() => {
    return fuzzySearch(filteredModels, debouncedSearch);
  }, [filteredModels, debouncedSearch]);

  return (
    <>
      <Average searched={searched} />
      <Previews searched={searched} />
    </>
  );
};
export default ModelTables;

interface AverageProps {
  searched: Model[];
  n?: number;
}

const equal = (o: AverageProps, n: AverageProps): boolean => {
  if (o.searched.length !== n.searched.length) return false;
  if (n.searched.length === 0) return true;

  for (let i = 0; i < n.searched.length; i++) {
    if (key(o.searched[i]) !== key(n.searched[i])) return false;
  }
  return true;
};

const Average = memo(({ searched, n = 20 }: AverageProps) => {
  const models = store((s) => s.models);
  const headers = store((s) => s.headers);
  const pins = store((s) => s.pins);

  const modelByKey: { [k: string]: Model } = {};
  models.forEach((m) => {
    modelByKey[key(m)] = m;
  });
  const pinned = pins.map((k) => modelByKey[k]);

  const searchedKeys = searched.map((m) => key(m));
  const pinnedKeySet = new Set(pins);
  const dedupedKeys = searchedKeys.filter((k) => !pinnedKeySet.has(k));
  const deduped = dedupedKeys.map((k) => modelByKey[k]);

  const average = topN(deduped, 'average', Math.max(n - pinned.length, 10));
  const merged = [...pinned, ...average];

  const meta = {
    total: pinned.length + deduped.length,
    topKeys: topKeys(merged),
  };

  return (
    <ModelTable models={merged} headers={headers} meta={meta} showPin sticky />
  );
}, equal);
Average.displayName = 'Average';

const Previews = memo(({ searched }: { searched: Model[] }) => {
  const n = 10;
  const average = topN(searched, 'average', n);
  // const arc = topN(searched, 'arc', n);
  // const hellaSwag = topN(searched, 'hellaswag', n);
  // const mmlu = topN(searched, 'mmlu', n);
  // const truthfulQA = topN(searched, 'truthfulqa', n);
  // const winogrande = topN(searched, 'winogrande', n);
  // const gsm8k = topN(searched, 'gsm8k', n);

  const meta = {
    total: searched.length,
    topKeys: topKeys(searched),
  };

  return (
    <>
      <ModelTable models={average} headers={['Average']} meta={meta} />
      {/*
      <ModelTable models={arc} headers={['ARC']} meta={meta} />
      <ModelTable models={hellaSwag} headers={['HellaSwag']} meta={meta} />
      <ModelTable models={mmlu} headers={['MMLU']} meta={meta} />
      <ModelTable models={truthfulQA} headers={['TruthfulQA']} meta={meta} />
      <ModelTable models={winogrande} headers={['Winogrande']} meta={meta} />
      <ModelTable models={gsm8k} headers={['GSM8k']} meta={meta} />
    */}
    </>
  );
}, equal);
Previews.displayName = 'Previews';

const top = (models: Model[], property: Sortable) =>
  models.reduce(
    (top, m) => (m[property] > top[property] ? m : top),
    models[0] || '',
  );

const topN = (models: Model[], property: Sortable, n: number) => {
  const descSort = (a: Model, b: Model) => b[property] - a[property];
  const sortedModels = [...models].sort(descSort);
  return sortedModels.slice(0, n);
};

const topKeys = (models: Model[]) => ({
  average: key(top(models, 'average')),
  arc: key(top(models, 'arc')),
  hellaswag: key(top(models, 'hellaswag')),
  mmlu: key(top(models, 'mmlu')),
  truthfulqa: key(top(models, 'truthfulqa')),
  winogrande: key(top(models, 'winogrande')),
  gsm8k: key(top(models, 'gsm8k')),
});
