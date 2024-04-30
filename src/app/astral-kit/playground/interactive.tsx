import Anthropic from '@anthropic-ai/sdk';
import {
  ArrowClockwise,
  BookOpen,
  Play,
  Stop,
} from '@phosphor-icons/react/dist/ssr';
import { useRef, useState } from 'react';

import IconLabelButton from '@/ui/icon-label-button';
import TextArea from '@/ui/text-area';
import { chat } from './api';
import s from './interactive.module.scss';

interface Props {
  system?: string;
  user?: string;
  input?: Record<string, string> | Record<string, string>[]; // array size relative to assistant
  prompt?: Message[];
  toggleInteractive: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Interactive = (p: Props) => {
  const ref = useRef<{ abort: AbortController | null }>({ abort: null });
  const [system, setSystem] = useState(p.system ?? '');
  const [user, setUser] = useState(p.user ?? '');
  const [assistant, setAssistant] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<Message[]>(p.prompt ?? []);
  const [waiting, setWaiting] = useState(false);

  const input: Record<string, string>[] = p.input
    ? Array.isArray(p.input)
      ? p.input
      : [p.input]
    : [];

  const hiddenFields: ('system' | 'input')[] = [];
  !system && hiddenFields.push('system');
  !input.length && hiddenFields.push('input');

  const placeholder = '(awaiting your input...)';

  const handleStream = (chunk: string) =>
    setAssistant((prev) => {
      const next = [...prev];
      next[0] = (next[0] ?? '') + chunk;
      return next;
    });
  const handleDone = () => {
    ref.current.abort?.abort();
    ref.current.abort = null;
    setWaiting(false);
  };

  // TODO: implement prompt with multiple roles

  return (
    <div
      className={[
        s.playground,
        hiddenFields.includes('system') ? '' : s['has-system'],
        hiddenFields.includes('input') ? '' : s['has-input'],
      ].join(' ')}
    >
      <div className={s.header}>
        {waiting ? (
          <IconLabelButton
            className={s.action}
            Icon={Stop}
            onPress={handleDone}
          >
            stop
          </IconLabelButton>
        ) : (
          <IconLabelButton
            className={s.action}
            isDisabled={!system.trim() && !user.trim() && !prompt.length}
            Icon={Play}
            onPress={async () => {
              if (!system.trim() && !user.trim() && !prompt.length) return;

              setWaiting(true);

              setAssistant((prev) => prev.map(() => ''));

              const messages: Anthropic.Messages.MessageParam[] = user
                ? [{ role: 'user', content: user }]
                : prompt;
              const abort = new AbortController();
              ref.current.abort = abort;

              chat({
                messages,
                system,
                handleStream,
                handleDone,
                abort,
              });
            }}
          >
            run
          </IconLabelButton>
        )}

        <IconLabelButton
          className={s.action}
          Icon={ArrowClockwise}
          onPress={() => {
            setSystem(p.system ?? '');
            setUser(p.user ?? '');
            setAssistant([]);
            handleDone();
          }}
        >
          reset
        </IconLabelButton>

        <IconLabelButton
          className={s.action}
          Icon={BookOpen}
          onPress={() => p.toggleInteractive()}
        >
          reader mode
        </IconLabelButton>
      </div>

      {!hiddenFields.includes('system') && (
        <TextArea
          className={s.system}
          label="System Prompt"
          onChange={setSystem}
          rows={5}
          placeholder=""
          value={system}
        />
      )}

      <div>
        {prompt.length > 0 ? (
          prompt.map((m, i) => (
            <TextArea
              key={i}
              className={s.user}
              label={m.role || '(unspecified role)'}
              onChange={setUser}
              rows={5}
              placeholder=""
              value={m.content}
            />
          ))
        ) : (
          <TextArea
            className={s.user}
            label="User"
            onChange={setUser}
            rows={5}
            placeholder=""
            value={user}
          />
        )}
      </div>

      <div
        className={s.io}
        style={{ '--size': p.input?.length } as React.CSSProperties}
      >
        <div className={s.assistant}>
          <div className={s.label}>{`Claude's Response`}</div>
          <div className={s.content}>
            {assistant[0] ?? (
              <span className={s.placeholder}>{placeholder}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Interactive;
