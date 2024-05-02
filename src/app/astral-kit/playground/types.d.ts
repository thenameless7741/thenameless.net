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
  questions: ('system' | 'user')[];
  answers: ('system' | 'user')[];
  eval: (assistant: string) => boolean;
}
