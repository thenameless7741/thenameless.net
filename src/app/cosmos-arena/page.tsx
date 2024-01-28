import { Metadata } from 'next';

import App from './app';
import { HF } from './types';

export const metadata: Metadata = {
  title: 'Cosmos Arena',
  description: 'An alternative UI for Open LLM Leaderboard.',
};

const Page = async () => {
  const updatedAt = new Date().toISOString().slice(0, 10);
  const hfModels = await loadHFModels();

  return <App updatedAt={updatedAt} hfModels={hfModels} />;
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

      let type: HF.Model['type'] | string = values[9];
      if (type === 'chat models (RLHF, DPO, IFT, ...)') {
        type = 'chat';
      } else if (type === 'fine-tuned on domain-specific datasets') {
        type = 'fine-tuned';
      } else if (type === 'base merges and moerges') {
        type = 'merge';
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

      let onHub: HF.Model['onHub'] = '';
      if (values[17] === 'True') {
        onHub = 'Y';
      } else if (values[17] === 'False') {
        onHub = 'N';
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
        onHub,
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
