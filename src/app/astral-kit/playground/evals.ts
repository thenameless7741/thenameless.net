import Anthropic from '@anthropic-ai/sdk';

import { tool } from './api';

type Block = Anthropic.Beta.Tools.Messages.ToolUseBlock;

interface EvalError {
  error: string;
  description?: string;
}

const evals: { [name: string]: (assistant: string) => Promise<boolean> } = {
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
      return false;
    }

    const numbers = res?.input.numbers;
    if (numbers?.length !== 3) return false;

    return [1, 2, 3].every((n) => numbers.includes(n));
  },

  // '01-system-prompt': (assistant) => {
  //   return /soo|giggles/i.test(assistant);
  // },
};
export default evals;
