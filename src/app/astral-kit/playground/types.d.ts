export namespace PlaygroundProps {
  export interface Base {
    system?: string;
    user?: string;
    input?: Params | Params[]; // array size relative to assistant, and vice versa
    prompt?: PromptMessage[]; // an alternative to user, assistant & input fields
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
  answers: EditableField[];
  eval: string;
}

export type EditableField = 'system' | 'user' | 'input';

export type Answer = 'correct' | 'incorrect' | 'unknown';

export interface Metric {
  input: number;
  output: number;
  ttft: number;
  e2e: number;
}
