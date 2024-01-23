import {
  ArchitectureGroup,
  Header,
  LicenseGroup,
  ParamGroup,
  Precision,
  Type,
  WeightType,
} from '../types';

export const headers: Header[] = [
  'Model',
  'Average',
  'ARC',
  'HellaSwag',
  'MMLU',
  'TruthfulQA',
  'Winogrande',
  'GSM8k',
  'Type',
  'Architecture',
  'Weight Type',
  'Precision',
  'Merged',
  'License',
  'Params',
  'Likes',
  'On Hub',
  'SHA',
  'Flagged',
  'MoE',
];

export const types: Type[] = ['pretrained', 'chat', 'fine-tuned', 'merge', ''];

export const weightTypes: WeightType[] = ['original', 'adapter', 'delta', ''];

export const precisions: Precision[] = [
  'float16',
  'bfloat16',
  '8bit',
  '4bit',
  'GPTQ',
  '',
];

export const licenseGroups: LicenseGroup[] = [
  'apache',
  'bigcode',
  'bigscience',
  'bsd',
  'cc',
  'creativeml',
  'gpl',
  'llama',
  'mit',
  'openrail',
  '',
];

export const paramGroups: ParamGroup[] = [
  '< 1',
  '1-3',
  '4-7',
  '8-13',
  '14-33',
  '34-70',
  '> 70',
  '0',
];

export const architectureGroups: ArchitectureGroup[] = [
  'Mistral',
  'Llama',
  'CausalLM',
  'other',
];

export const headerDescriptions: { [k in Header]?: string } = {
  ARC: 'A set of grade-school science questions.',
  HellaSwag:
    'A test of commonsense inference, which is easy for humans (~95%) but challenging for SOTA models.',
  MMLU: "A test to measure a text model's multitask accuracy. The test covers 57 tasks including elementary mathematics, US history, computer science, law, and more.",
  TruthfulQA:
    'A test to measure a model’s propensity to reproduce falsehoods commonly found online.',
  Winogrande:
    'An adversarial and difficult Winograd benchmark at scale, for commonsense reasoning.',
  GSM8k:
    "Diverse grade school math word problems to measure a model's ability to solve multi-step mathematical reasoning problems.",
};
