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
  exercise?: {
    requiredFields: ('system' | 'user')[];
  };
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Interactive = (p: Props) => {
  /* states */
  const ref = useRef<{ abort: AbortController | null }>({ abort: null });

  const [system, setSystem] = useState(() => {
    const hide = p.exercise?.requiredFields.includes('system');
    return hide ? '' : p.system ?? '';
  });
  const getInitialPrompt = (): Message[] => {
    const hide = p.exercise?.requiredFields.includes('user');

    if (p.prompt) {
      return p.prompt.map((m) => {
        let content = m.content;
        if (m.role === 'user' && hide) {
          content = '';
        }
        // deep clone
        return { ...m, content };
      });
    }

    const content = hide ? '' : p.user ?? '';
    return [{ role: 'user', content }];
  };
  const [prompt, setPrompt] = useState<Message[]>(getInitialPrompt);
  const [assistant, setAssistant] = useState<string[]>([]);
  const [waiting, setWaiting] = useState(false);

  /* computed properties */

  const input: Record<string, string>[] = p.input
    ? Array.isArray(p.input)
      ? p.input
      : [p.input]
    : [];

  const hiddenFields: ('system' | 'input')[] = [];
  !p.system && hiddenFields.push('system');
  !input.length && hiddenFields.push('input');

  /* header's handlers */

  const empty = !system.trim() && !prompt.length;

  const handleRun = async () => {
    if (empty) return;

    setWaiting(true);

    setAssistant((prev) => prev.map(() => ''));

    const abort = new AbortController();
    ref.current.abort = abort;

    chat({
      messages: prompt,
      system,
      handleStream,
      handleDone,
      abort,
    });
  };
  const handleReset = () => {
    setSystem(p.system ?? '');
    setPrompt(getInitialPrompt);
    setAssistant([]);
    handleDone();
  };
  const handleReaderMode = () => p.toggleInteractive();

  /* handlers */

  const handleContentChange = (content: string, i: number) => {
    const m: Message = { ...prompt[i], content };
    const ms = [...prompt.slice(0, i), m, ...prompt.slice(i + 1)];
    setPrompt(ms);
  };
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
    <div
      className={[
        s.playground,
        hiddenFields.includes('system') ? '' : s['has-system'],
        hiddenFields.includes('input') ? '' : s['has-input'],
      ].join(' ')}
    >
      <Header
        empty={empty}
        waiting={waiting}
        handleStop={handleDone}
        handleRun={handleRun}
        handleReset={handleReset}
        handleReaderMode={handleReaderMode}
      />

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
        {prompt.map((m, i) => (
          <TextArea
            key={i}
            className={s.user}
            label={m.role || '(unspecified role)'}
            onChange={(content) => handleContentChange(content, i)}
            rows={5}
            placeholder=""
            value={m.content}
          />
        ))}
      </div>

      <div
        className={s.io}
        style={{ '--size': p.input?.length } as React.CSSProperties}
      >
        <div className={s.assistant}>
          <div className={s.label}>{`Claude's Response`}</div>
          <div className={s.content}>
            {assistant[0] ?? (
              <span className={s.placeholder}>(awaiting your input...)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Interactive;

interface HeaderProps {
  empty: boolean;
  waiting: boolean;
  handleStop: () => void;
  handleRun: () => void;
  handleReset: () => void;
  handleReaderMode: () => void;
}
const Header = (p: HeaderProps) => {
  return (
    <div className={s.header}>
      {p.waiting ? (
        <IconLabelButton
          className={s.action}
          Icon={Stop}
          onPress={p.handleStop}
        >
          stop
        </IconLabelButton>
      ) : (
        <IconLabelButton
          className={s.action}
          isDisabled={p.empty}
          Icon={Play}
          onPress={p.handleRun}
        >
          run
        </IconLabelButton>
      )}

      <IconLabelButton
        className={s.action}
        Icon={ArrowClockwise}
        onPress={p.handleReset}
      >
        reset
      </IconLabelButton>

      <IconLabelButton
        className={s.action}
        Icon={BookOpen}
        onPress={p.handleReaderMode}
      >
        reader mode
      </IconLabelButton>
    </div>
  );
};
