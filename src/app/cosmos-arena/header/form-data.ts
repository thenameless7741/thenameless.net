import { HF, LMSYS } from '../types';

export const headers: HF.Header[] = [
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
  'SHA',
  'Flagged',
  'MoE',
];

export const types: HF.Type[] = [
  'pretrained',
  'continual',
  'chat',
  'fine-tuned',
  'merge',
  '',
];

export const weightTypes: HF.WeightType[] = [
  'original',
  'adapter',
  'delta',
  '',
];

export const precisions: HF.Precision[] = [
  'float16',
  'bfloat16',
  '8bit',
  '4bit',
  'GPTQ',
  '',
];

export const licenseGroups: HF.LicenseGroup[] = [
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

export const paramGroups: HF.ParamGroup[] = [
  '< 1',
  '1-3',
  '4-7',
  '8-13',
  '14-33',
  '34-70',
  '> 70',
  '0',
];

export const architectureGroups: HF.ArchitectureGroup[] = [
  'Mistral',
  'Llama',
  'CausalLM',
  'other',
];

export const headerDescriptions: { [k in HF.Header | LMSYS.Header]?: string } =
  {
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
    CI: "Confidence Interval: A statistical range estimating a model's true skill level uncertainty, indicating where the true skill likely falls within a specified confidence level (e.g., 95%). A model will only be ranked higher if its lower-bound rating exceeds the upper-bound of another.",
    Elo: 'A method for calculating the relative skill levels of players in zero-sum games such as chess, and more recently LLMs. Chatbot Arena has transitioned to use Bradley-Terry model in late 2023.',
  };
