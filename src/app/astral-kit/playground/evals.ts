import Anthropic from '@anthropic-ai/sdk';

import { tool as api } from './api';
import { Answer } from './types';

type Block = Anthropic.Beta.Tools.Messages.ToolUseBlock;

interface EvalError {
  error: string;
  description?: string;
}

const evals: { [name: string]: (assistant: string) => Promise<Answer> } = {
  '01-counting-to-three': async (assistant) => {
    const tool: Anthropic.Beta.Tools.Tool = {
      name: 'print_numbers',
      description: 'Prints all numbers.',
      input_schema: {
        type: 'object',
        properties: {
          numbers: { type: 'array', items: { type: 'number' } },
        },
        required: ['numbers'],
      },
    };

    let numbers: number[] = [];
    try {
      interface EvalBlock extends Block {
        input: { numbers: number[] };
      }
      const { input } = await evalAnswer<EvalBlock>(assistant, tool);
      numbers = input.numbers;
    } catch (err) {
      return 'unknown';
    }

    return numbers.length === 3 && [1, 2, 3].every((n) => numbers.includes(n))
      ? 'correct'
      : 'incorrect';
  },

  '01-system-prompt': async (assistant) => {
    const tool: Anthropic.Beta.Tools.Tool = {
      name: 'is_childlike',
      description:
        'Determine whether a piece of text was written by a child or not.',
      input_schema: {
        type: 'object',
        properties: {
          childlike: { type: 'boolean' },
        },
        required: ['childlike'],
      },
    };

    let childlike = false;
    try {
      interface EvalBlock extends Block {
        input: {
          childlike: boolean;
        };
      }
      const { input } = await evalAnswer<EvalBlock>(assistant, tool);
      childlike = input.childlike;
    } catch (err) {
      return 'unknown';
    }

    return childlike ? 'correct' : 'incorrect';
  },

  '02-spanish': async (assistant) => {
    const tool: Anthropic.Beta.Tools.Tool = {
      name: 'is_spanish',
      description: 'Determine whether a piece of text is in spanish or not.',
      input_schema: {
        type: 'object',
        properties: {
          spanish: { type: 'boolean' },
        },
        required: ['spanish'],
      },
    };

    let spanish = false;
    try {
      interface EvalBlock extends Block {
        input: {
          spanish: boolean;
        };
      }
      const { input } = await evalAnswer<EvalBlock>(assistant, tool);
      spanish = input.spanish;
    } catch (err) {
      return 'unknown';
    }

    return spanish ? 'correct' : 'incorrect';
  },

  '02-one-player-only': async (assistant) => {
    const tool: Anthropic.Beta.Tools.Tool = {
      name: 'is_goat',
      description:
        'Determine whether a piece of text contains only the name of a person who is considered the Greatest of All Time (GOAT) in basketball.',
      input_schema: {
        type: 'object',
        properties: {
          goat: { type: 'boolean' },
          nameOnly: { nameOnly: 'boolean' },
        },
        required: ['goat', 'nameOnly'],
      },
    };

    let goat = false;
    let nameOnly = false;
    try {
      interface EvalBlock extends Block {
        input: {
          goat: boolean;
          nameOnly: boolean;
        };
      }
      const { input } = await evalAnswer<EvalBlock>(assistant, tool);
      ({ goat, nameOnly } = input);
    } catch (err) {
      return 'unknown';
    }

    return goat && nameOnly ? 'correct' : 'incorrect';
  },

  '02-write-a-story': async (assistant) => {
    return assistant.split(/\s+/).length > 800 ? 'correct' : 'incorrect';
  },

  '03-math-correction': async (assistant) => {
    const tool: Anthropic.Beta.Tools.Tool = {
      name: 'correct',
      description: 'Determine whether a solution is graded as correct.',
      input_schema: {
        type: 'object',
        properties: {
          correct: { type: 'boolean' },
        },
        required: ['correct'],
      },
    };

    let correct = false;
    try {
      interface EvalBlock extends Block {
        input: {
          correct: boolean;
        };
      }
      const { input } = await evalAnswer<EvalBlock>(assistant, tool);
      correct = input.correct;
    } catch (err) {
      return 'unknown';
    }

    return correct ? 'incorrect' : 'correct';
  },
};
export default evals;

const evalAnswer = async <T extends Block>(
  answer: string,
  tool: Anthropic.Beta.Tools.Tool,
) => {
  const content = `<text>${answer}</text>
Use the \`${tool.name}\` tool.`;

  const res = await api<T | EvalError>({
    messages: [{ role: 'user', content }],
    tools: [tool],
  });
  if ('error' in res) {
    console.error(res);
    throw Error(res.error);
  }

  return res;
};
