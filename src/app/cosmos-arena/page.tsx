import { Metadata } from 'next';

import App from './app';
import { HF, LMSYS } from './types';

export const metadata: Metadata = {
  title: 'Cosmos Arena',
  description: 'An alternative UI for Open LLM Leaderboard.',
};

const Page = async () => {
  const updatedAt = new Date().toISOString().slice(0, 10);
  const hfModels = await loadHFModels();
  const lmsysModels: LMSYS.Model[] = await loadLMSYSModel();

  return (
    <App updatedAt={updatedAt} hfModels={hfModels} lmsysModels={lmsysModels} />
  );
};
export default Page;

const loadHFModels = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_CF_R2_BASE_URL;
  const res = await fetch(`${baseUrl}/cosmos-arena/open-llm-leaderboard.csv`, {
    headers: {
      cache: 'no-store',
      'Content-Type': 'text/csv; charset=UTF-8',
    },
  });
  const data = await res.text();

  const lines = data.trim().split('\n');
  // remove header
  lines.shift();

  const parseBoolean = (s: string) => {
    let value = false;

    if (s === 'True') {
      value = true;
    } else if (s === 'False') {
      value = false;
    } else {
      // throw new Error(`parseBoolean is failed, input: ${s}, type: ${typeof s}`);
      console.error(`parseBoolean is failed, input: ${s}, type: ${typeof s}`);
    }

    return value;
  };

  const csvRegex = /(?:,|^)(?:"((?:[^"]|"")*)"|([^",]*))/g;
  const split = (l: string) => {
    let match;
    const values = [];
    let lastIndex = 0;

    while ((match = csvRegex.exec(l))) {
      // check if the match starts immediately after the last match to detect empty values
      if (match.index !== lastIndex) {
        values.push('');
      }
      // if the value is quoted, replace double quotes with a single quote
      values.push(
        match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2],
      );
      lastIndex = csvRegex.lastIndex;
    }

    // handle the case where the last value is empty
    if (l.endsWith(',')) {
      values.push('');
    }

    return values;
  };

  const models: HF.Model[] = lines
    .map((l) => {
      if (l.startsWith(',baseline')) return null;

      const values = split(l);

      const hf = values[1].includes('/');
      const user = hf ? values[1].split('/')[0] : values[1];
      const blocked = []
        .map((s) => user.startsWith(s))
        .reduce((b, v) => b || v, false);
      if (blocked) return null;

      const deleted = values[17] !== 'True'; // onHub
      if (deleted) return null;

      let type: HF.Model['type'] | string = values[9];
      if (type === 'chat models (RLHF, DPO, IFT, ...)') {
        type = 'chat';
      } else if (type === 'fine-tuned on domain-specific datasets') {
        type = 'fine-tuned';
      } else if (type === 'base merges and moerges') {
        type = 'merge';
      } else if (type === 'continuously pretrained') {
        type = 'continual';
      } else if (type !== 'pretrained' && type !== '') {
        console.error(`unexpected type value: ${type}`);
      }

      let architecture = values[10];
      if (architecture === '?') {
        architecture = '';
      }

      let architectureGroup: HF.Model['architectureGroup'] = 'other';
      if (architecture.includes('Mistral')) {
        architectureGroup = 'Mistral';
      } else if (architecture.includes('Llama')) {
        architectureGroup = 'Llama';
      } else if (architecture.includes('CausalLM')) {
        architectureGroup = 'CausalLM';
      }

      let license = values[14];
      if (['?', 'other', 'unknown'].includes(license)) {
        license = '';
      } else if (license.startsWith('[')) {
        const licenses: string[] = JSON.parse(license.replaceAll("'", '"'));
        license = licenses.length > 0 ? licenses[0] : '';
      }

      const regex =
        /^apache|^bigcode|^bigscience|^bsd|^cc|^creativeml|gpl|^llama|^mit$|^openrail/;
      const matches = license.match(regex);
      const licenseGroup = ((matches && matches[0]) || '') as HF.LicenseGroup;

      const param = +values[15];

      let paramGroup: HF.ParamGroup;
      if (param === 0) {
        paramGroup = '0';
      } else if (param < 1) {
        paramGroup = '< 1';
      } else {
        const p = Math.round(param);

        if (p < 4) {
          paramGroup = '1-3';
        } else if (p < 8) {
          paramGroup = '4-7';
        } else if (p < 14) {
          paramGroup = '8-13';
        } else if (p < 34) {
          paramGroup = '14-33';
        } else if (p < 71) {
          paramGroup = '34-70';
        } else {
          paramGroup = '> 70';
        }
      }

      let sha = values[18];
      if (sha === 'N/A') {
        sha = '';
      }

      return {
        // symbol: values[0], skip
        name: values[1],
        average: +values[2],
        arc: +values[3],
        hellaswag: +values[4],
        mmlu: +values[5],
        truthfulqa: +values[6],
        winogrande: +values[7],
        gsm8k: +values[8],
        type,
        architecture,
        weightType: values[11].toLowerCase() as HF.WeightType,
        precision: values[12] as HF.Model['precision'],
        merged: parseBoolean(values[13]),
        license,
        param,
        like: +values[16],
        // onHub: values[17], skip
        sha,
        flagged: parseBoolean(values[19]),
        moe: parseBoolean(values[20]),
        licenseGroup,
        paramGroup,
        architectureGroup,
      };
    })
    .filter((m): m is HF.Model => !!m);

  return models;
};

const loadLMSYSModel = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_CF_R2_BASE_URL;
  const res = await fetch(`${baseUrl}/cosmos-arena/chatbot-arena.json`, {
    headers: {
      cache: 'no-store',
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
  const models: LMSYS.Model[] = await res.json();

  const urlByModel: { [m: LMSYS.Model['name']]: string } = {
    'Alpaca-13B': 'https://huggingface.co/chansung/gpt4-alpaca-lora-13b',
    'Koala-13B': 'https://huggingface.co/TheBloke/koala-13B-HF',
    'LLaMA-13B': 'https://huggingface.co/TheBloke/LLaMa-13B-GGML',
    'Mixtral-8x7b-Instruct-v0.1':
      'https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1',
    'Qwen1.5-4B-Chat': 'https://huggingface.co/Qwen/Qwen1.5-4B-Chat',
    'Qwen1.5-72B-Chat': 'https://huggingface.co/Qwen/Qwen1.5-72B-Chat',
    'Qwen1.5-7B-Chat': 'https://huggingface.co/Qwen/Qwen1.5-7B-Chat',
  };

  const toolUse: Set<LMSYS.Model['name']> = new Set([
    'Bard (Gemini Pro)',
    'pplx-70b-online',
    'pplx-7b-online',
  ]);

  models.forEach((m) => {
    if (urlByModel[m.name]) {
      m.url = urlByModel[m.name];
    }
    if (m.cutoff === 'Unknown') {
      m.cutoff = '';
    }
    m.onHub = /^https?:\/\/(www\.)?huggingface\.co/.test(m.url);
    m.toolUse = toolUse.has(m.name);
  });

  return models;
};
