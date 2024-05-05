import { Icon } from '@phosphor-icons/react';
import {
  ArrowClockwise,
  BookOpen,
  Check,
  Play,
  Stop,
  Warning,
  X,
} from '@phosphor-icons/react/dist/ssr';
import { useContext, useRef, useState } from 'react';
import { useStore } from 'zustand';

import IconLabelButton from '@/ui/icon-label-button';
import TextArea from '@/ui/text-area';
import store, { usePlaygroundContext, PlaygroundContext } from '../store';
import { chat } from './api';
import evals from './evals';
import {
  Answer,
  EditableField,
  Metric,
  PlaygroundProps as PP,
  Params,
  PromptMessage,
} from './types';
import s from './interactive.module.scss';

type Props = PP.Base &
  PP.Interactive & {
    toggleInteractive: () => void;
  };

const Interactive = (p: Props) => {
  /* states */
  const ref = useRef<{ abort: AbortController | null }>({ abort: null });
  const showMetric = store((s) => s.showMetric);
  const playgroundStore = useContext(PlaygroundContext)!;
  const toast = useStore(playgroundStore, (s) => s.toast);
  const assistant = useStore(playgroundStore, (s) => s.assistant);

  const [system, setSystem] = useState(() => {
    const exercise = p.exercise?.answers.includes('system');
    return exercise ? '' : p.system ?? '';
  });
  const getInitialPrompt = (): PromptMessage[] => {
    const exercise = p.exercise?.answers.includes('user');

    if (p.prompt) {
      return p.prompt.map((m) => {
        let content = m.content;
        if (m.role === 'user' && exercise) {
          content = '';
        }
        // deep clone
        return { ...m, content };
      });
    }

    const content = exercise ? '' : p.user ?? '';
    return [{ role: 'user', content }];
  };
  const [prompt, setPrompt] = useState<PromptMessage[]>(getInitialPrompt);
  const [waiting, setWaiting] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);

  /* computed properties */

  const input: Params[] = p.input
    ? Array.isArray(p.input)
      ? p.input
      : [p.input]
    : [];

  const fields: EditableField[] = ['system', 'user', 'input'];
  const answerFields: EditableField[] = p.exercise?.answers ?? [];
  const questionFields: EditableField[] = fields.filter(
    (a) => !answerFields.includes(a),
  );

  let AnswerIcon: Icon | null = null;
  switch (answer) {
    case 'correct':
      AnswerIcon = Check;
      break;
    case 'incorrect':
      AnswerIcon = X;
      break;
    case 'unknown':
      AnswerIcon = Warning;
      break;
  }

  /* header's handlers */

  const empty = !system.trim() && !prompt.length;

  const handleRun = async () => {
    if (empty) return;

    setWaiting(true);
    !!p.exercise && setAnswer(null);

    playgroundStore.setState({ assistant: [], metric: null });

    const abort = new AbortController();
    ref.current.abort = abort;

    await chat({
      messages: prompt,
      system,
      handleStream,
      handleDone,
      abort,
    });

    if (!p.exercise) return;

    const evalFn = evals[p.exercise.eval];
    const { assistant } = playgroundStore.getState();
    const answer = await evalFn(assistant[0]);
    setAnswer(answer);

    if (answer === 'unknown') {
      // @ts-ignore incomplete type
      toast.add('Apologies, there seems to be a problem. Please try again.', {
        timeout: 5_000,
      });
    }
  };
  const handleReset = () => {
    setSystem(p.system ?? '');
    setPrompt(getInitialPrompt);
    playgroundStore.setState({ assistant: [], metric: null });
    handleDone();
    setAnswer(null);
  };
  const handleReaderMode = () => p.toggleInteractive();

  /* handlers */

  const handleContentChange = (content: string, i: number) => {
    const m: PromptMessage = { ...prompt[i], content };
    const ms = [...prompt.slice(0, i), m, ...prompt.slice(i + 1)];
    setPrompt(ms);
  };
  const handleStream = (chunk: string) => {
    const { showMetric } = store.getState();
    const metricToken = '<|metric|>';
    let metric: Metric | null = null;

    if (showMetric && chunk.includes(metricToken)) {
      const texts = chunk.split(metricToken);
      chunk = texts[0];

      try {
        metric = JSON.parse(texts[1]);
      } catch (err) {
        console.error(err);
      }
    }

    playgroundStore.setState(({ assistant: prev }) => {
      const next = [...prev];
      next[0] = (next[0] ?? '') + chunk;
      return { assistant: next, metric };
    });
  };
  const handleDone = () => {
    ref.current.abort?.abort();
    ref.current.abort = null;
    setWaiting(false);
  };

  return (
    <div
      className={[
        s.playground,
        p.system ? s['has-system'] : '',
        input.length > 0 ? s['has-input'] : '',
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

      {!!p.system && (
        <TextArea
          className={s.system}
          isDisabled={!!p.exercise && questionFields.includes('system')}
          label="System Prompt"
          onChange={setSystem}
          rows={5}
          placeholder="Enter your system prompt here..."
          value={system}
        />
      )}

      <div>
        {prompt.map((m, i) => (
          <TextArea
            key={i}
            className={s.user}
            isDisabled={!!p.exercise && questionFields.includes('user')}
            label={m.role || '(unspecified role)'}
            onChange={(content) => handleContentChange(content, i)}
            rows={5}
            placeholder="Enter your prompt for User role here..."
            value={m.content}
          />
        ))}
      </div>

      <div
        className={s.io}
        style={{ '--size': p.input?.length } as React.CSSProperties}
      >
        <div className={s.assistant}>
          <div className={s.label}>
            {`Claude's Response`}
            {!!p.exercise && !!answer && !!AnswerIcon && (
              <AnswerIcon
                aria-label={`${answer} answer`}
                className={s[answer]}
                weight="bold"
                size={16}
              />
            )}
          </div>

          <div className={s.content}>
            {assistant[0] ?? (
              <span className={s.placeholder}>
                {answer === 'unknown'
                  ? '(please try again...)'
                  : '(awaiting your input...)'}
              </span>
            )}
          </div>

          {showMetric && <Metric />}
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

const Metric = () => {
  const m = usePlaygroundContext((s) => s.metric);
  if (!m) return null;

  const nf = new Intl.NumberFormat('en-US');

  return (
    <ul className={s.metric}>
      <li className={s['metric-item']}>
        <span className={s['metric-label']}>Input</span>
        <span className={s['metric-value']}>{nf.format(m.input)} tokens</span>
      </li>
      <li className={s['metric-item']}>
        <span className={s['metric-label']}>TTFT</span>
        <span className={s['metric-value']}>{nf.format(m.ttft)} ms</span>
      </li>
      <li className={s['metric-item']}>
        <span className={s['metric-label']}>Output</span>
        <span className={s['metric-value']}>{nf.format(m.output)} tokens</span>
      </li>
      <li className={s['metric-item']}>
        <span className={s['metric-label']}>E2E</span>
        <span className={s['metric-value']}>{nf.format(m.e2e)} ms</span>
      </li>
    </ul>
  );
};
