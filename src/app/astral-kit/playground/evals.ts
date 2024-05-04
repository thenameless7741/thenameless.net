import Anthropic from '@anthropic-ai/sdk';

import { tool } from './api';
import { Answer } from './types';

type Block = Anthropic.Beta.Tools.Messages.ToolUseBlock;

interface EvalError {
  error: string;
  description?: string;
}

const evals: { [name: string]: (assistant: string) => Promise<Answer> } = {
  '01-counting-to-three': async (assistant) => {
    const printNumbers: Anthropic.Beta.Tools.Tool = {
      name: 'print_numbers',
      description: 'Prints all numbers.',
      input_schema: {
        type: 'object',
        properties: {
          numbers: {
            type: 'array',
            items: { type: 'number' },
          },
        },
      },
    };

    const content = `
<text>
${assistant}
</text>

Use the \`${printNumbers.name}\` tool.`;

    type EvalBlock = Block & {
      input: {
        numbers: number[];
      };
    };
    const res = await tool<EvalBlock | EvalError>({
      messages: [{ role: 'user', content }],
      tools: [printNumbers],
    });
    if ('error' in res) {
      console.error(res);
      return 'unknown';
    }

    const numbers = res?.input.numbers;
    if (numbers?.length !== 3) return 'incorrect';

    return [1, 2, 3].every((n) => numbers.includes(n))
      ? 'correct'
      : 'incorrect';
  },

  // '01-system-prompt': (assistant) => {
  //   return /soo|giggles/i.test(assistant);
  // },
};
export default evals;
