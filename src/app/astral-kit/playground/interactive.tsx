import Anthropic from '@anthropic-ai/sdk';

import Button from '@/ui/button';
import { chat } from './api';
import s from './interactive.module.scss';

interface Props {
  system?: string;
  user?: string;
  labels?: {
    system?: string;
    user?: string;
    assistant?: string;
  };
  input?: Record<string, string> | Record<string, string>[]; // array size relative to assistant
}

const Interactive = (p: Props) => {
  const assistant: string[] = [];
  const input: Record<string, string>[] = !p.input
    ? []
    : Array.isArray(p.input)
      ? p.input
      : [p.input];

  return (
    <div className={s.playground}>
      <Button
        onPress={async () => {
          const messages: Anthropic.Messages.MessageParam[] = [
            { role: 'user', content: 'Hello, 世界!' },
          ];
          chat({ messages });
        }}
      >
        test
      </Button>
    </div>
  );
};
export default Interactive;
