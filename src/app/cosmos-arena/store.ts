import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { HF } from './types';

const hfDefaultHeaders: HF.Header[] = [
  'Model',
  'Average',
  'ARC',
  'HellaSwag',
  'MMLU',
  'TruthfulQA',
  'Winogrande',
  'GSM8k',
  'Params',
];
export const hfStore = create<HF.Store>()(
  persist(
    (set, get) => ({
      updatedAt: '',
      models: [],
      filteredModels: [],
      headers: [...hfDefaultHeaders],
      resetHeaders: () => set(() => ({ headers: [...hfDefaultHeaders] })),
      pins: [],
      togglePin: (pin: string) =>
        set(({ pins }) => {
          if (!pins.includes(pin)) {
            return { pins: [...pins, pin] };
          }

          const newPins: string[] = pins.filter((p) => pin !== p);
          return { pins: newPins };
        }),
      search: '',

      types: [],
      weightTypes: [],
      precisions: [],
      licenseGroups: [],
      paramGroups: [],
      architectureGroups: [],
      exclusions: {
        merged: true,
        flagged: true,
        moe: false,
      },
    }),
    {
      name: 'cosmos-arena',
      partialize: ({ updatedAt, headers, pins }) => ({ headers, pins }),
    },
  ),
);
