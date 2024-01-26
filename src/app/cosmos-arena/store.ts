import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  ArchitectureGroup,
  Header,
  Model,
  LicenseGroup,
  ParamGroup,
  Precision,
  Type,
  WeightType,
} from './types';

export interface Store {
  models: Model[];
  updatedAt: string;
  filteredModels: Model[];
  headers: Header[];
  resetHeaders: () => void;
  pins: string[];
  togglePin: (pin: string) => void;
  search: string;

  types: Type[];
  weightTypes: WeightType[];
  precisions: Precision[];
  licenseGroups: LicenseGroup[];
  paramGroups: ParamGroup[];
  architectureGroups: ArchitectureGroup[];
  exclusions: {
    merged: boolean;
    flagged: boolean;
    moe: boolean;
  };
}

const defaultHeaders: Header[] = [
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

const store = create<Store>()(
  persist(
    (set, get) => ({
      models: [],
      updatedAt: '',
      filteredModels: [],
      headers: [...defaultHeaders],
      resetHeaders: () => set(() => ({ headers: [...defaultHeaders] })),
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

export default store;
