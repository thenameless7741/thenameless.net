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
  toggleInteractive: () => void;
}

const Interactive = (p: Props) => {
  const ref = useRef<{ abort: AbortController | null }>({ abort: null });
  const [system, setSystem] = useState(p.system ?? '');
  const [user, setUser] = useState(p.user ?? '');
  const [assistant, setAssistant] = useState<string[]>([]);
  const [waiting, setWaiting] = useState(false);

  const input: Record<string, string>[] = p.input
    ? Array.isArray(p.input)
      ? p.input
      : [p.input]
    : [];
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

  return (
    <div className={s.playground}>
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
            isDisabled={!system.trim() && !user.trim()}
            Icon={Play}
            onPress={async () => {
              if (!system.trim() && !user.trim()) return;

              setWaiting(true);

              setAssistant((prev) => prev.map(() => ''));

              const messages: Anthropic.Messages.MessageParam[] = [
                { role: 'user', content: user },
              ];
              const abort = new AbortController();
              ref.current.abort = abort;

              chat({
                messages,
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
