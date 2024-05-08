export namespace PlaygroundProps {
  export interface Base {
    system?: string;
    user?: string;
    prompt?: PromptMessage[]; // an alternative to user, assistant & input fields
    input?: Params | Params[]; // array size relative to assistant, and vice versa
  }

  export interface Interactive {
    exercise?: Exercise;
  }

  export interface NonInteractive {
    assistant?: string | string[]; // array size relative to input
    labels?: {
      system?: string;
      user?: string;
      assistant?: string;
    };
  }
}

export type Params = Record<string, string>;

export interface PromptMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Exercise {
  eval: string;
  answers: EditableField[];
  initialUser?: string;
  initialPrompt?: PromptMessage[]; // array size relative to prompt
  initialInput?: Params[]; // array size relative to input
}

export type EditableField = 'system' | 'user' | 'input' | 'prompt';

export type Answer = 'correct' | 'incorrect' | 'unknown';

export interface Metric {
  input: number;
  output: number;
  ttft: number;
  e2e: number;
}
