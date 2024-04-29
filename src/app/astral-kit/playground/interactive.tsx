import Anthropic from '@anthropic-ai/sdk';
import {
  ArrowClockwise,
  ArrowElbowDownRight,
} from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';

import IconLabelButton from '@/ui/icon-label-button';
import TextArea from '@/ui/text-area';
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
  const input: Record<string, string>[] = p.input
    ? Array.isArray(p.input)
      ? p.input
      : [p.input]
    : [];

  const [user, setUser] = useState(p.user ?? '');
  const [assistant, setAssistant] = useState<string[]>([]);

  return (
    <div className={s.playground}>
      <TextArea
        className={s.user}
        label="user"
        onChange={setUser}
        rows={5}
        placeholder=""
        value={user.replace(/^User: /, '')}
      />

      <div
        className={s.io}
        style={{ '--size': p.input?.length } as React.CSSProperties}
      >
        <div className={s.assistant}>
          <div className={s.label}>assistant</div>
          <div className={s.content}>{assistant[0] ?? ''}</div>
        </div>
      </div>

      <div className={s.footer}>
        <IconLabelButton
          Icon={ArrowElbowDownRight}
          onPress={async () => {
            setAssistant((prev) => prev.map(() => ''));

            const messages: Anthropic.Messages.MessageParam[] = [
              { role: 'user', content: user },
            ];

            chat({
              messages,
              handleStream: (s) =>
                setAssistant((prev) => {
                  const next = [...prev];
                  next[0] = (next[0] ?? '') + s;
                  return next;
                }),
            });
          }}
        >
          generate
        </IconLabelButton>

        <IconLabelButton
          Icon={ArrowClockwise}
          onPress={() => {
            setUser(p.user ?? '');
            setAssistant(['']);
          }}
        >
          reset
        </IconLabelButton>
      </div>
    </div>
  );
};
export default Interactive;
