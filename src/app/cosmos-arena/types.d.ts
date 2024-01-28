export namespace HF {
  export interface Store {
    updatedAt: string;
    models: Model[];
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

  export interface Model {
    name: string;
    average: number;
    arc: number;
    hellaswag: number;
    mmlu: number;
    truthfulqa: number;
    winogrande: number;
    gsm8k: number;
    type: Type;
    architecture: string;
    weightType: WeightType;
    precision: Precision;
    merged: boolean;
    license: string;
    param: number;
    like: number;
    onHub: 'Y' | 'N' | '';
    sha: string;
    flagged: boolean;
    moe: boolean;
    licenseGroup: LicenseGroup;
    paramGroup: ParamGroup;
    architectureGroup: ArchitectureGroup;
  }

  export type Type =
    | 'pretrained'
    | 'chat' // chat models (RLHF, DPO, IFT, ...)
    | 'fine-tuned' // fine-tuned on domain-specific datasets
    | 'merge' // base merges and moerges
    | '';

  export type WeightType = 'original' | 'adapter' | 'delta' | '';

  export type Precision =
    | 'float16'
    | 'bfloat16'
    | '8bit'
    | '4bit'
    | 'GPTQ'
    | '';

  export type LicenseGroup =
    | 'apache'
    | 'bigcode'
    | 'bigscience'
    | 'bsd'
    | 'cc'
    | 'creativeml'
    | 'gpl'
    | 'llama'
    | 'mit'
    | 'openrail'
    | '';

  export type ParamGroup =
    | '< 1'
    | '1-3'
    | '4-7'
    | '8-13'
    | '14-33'
    | '34-70'
    | '> 70'
    | '0';

  export type ArchitectureGroup = 'Mistral' | 'Llama' | 'CausalLM' | 'other';

  export type Header =
    | 'Model'
    | 'Average'
    | 'ARC'
    | 'HellaSwag'
    | 'MMLU'
    | 'TruthfulQA'
    | 'Winogrande'
    | 'GSM8k'
    | 'Type'
    | 'Architecture'
    | 'Weight Type'
    | 'Precision'
    | 'Merged'
    | 'License'
    | 'Params'
    | 'Likes'
    | 'On Hub'
    | 'SHA'
    | 'Flagged'
    | 'MoE';

  type Include<T, U> = T extends U ? T : never;

  // number only
  export type Sortable = Include<
    keyof Model,
    | 'average'
    | 'arc'
    | 'hellaswag'
    | 'mmlu'
    | 'truthfulqa'
    | 'winogrande'
    | 'gsm8k'
    | 'param'
    | 'like'
  >;
}

export namespace LMSYS {
  export interface Store {
    updatedAt: string;
    models: Model[];
    filteredModels: Model[];

    onHub: boolean;
    exclusions: {
      toolUse: boolean;
    };
  }

  export interface Model {
    name: string;
    url: string;
    elo: number;
    votes: number;
    organization: string;
    license: string;
    onHub: boolean;
    toolUse: boolean;
  }

  export type Header =
    | 'Model'
    | 'Elo'
    | 'Votes'
    | 'Organization'
    | 'License'
    | 'Tool-Use';

  // number only
  export type Sortable = Include<keyof Model, 'elo' | 'votes'>;
}
