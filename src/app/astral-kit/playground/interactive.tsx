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
import React, { useContext, useId, useRef, useState } from 'react';
import { Label } from 'react-aria-components';
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
  const id = useId();
  const ref = useRef<{ abort: AbortController | null }>({ abort: null });
  const showMetric = store((s) => s.showMetric);
  const playgroundStore = useContext(PlaygroundContext)!;
  const toast = useStore(playgroundStore, (s) => s.toast);
  const assistant = useStore(playgroundStore, (s) => s.assistant);

  const [system, setSystem] = useState(() => {
    const exercise = !!p.exercise?.answers.includes('system');
    return exercise ? '' : p.system ?? '';
  });
  const getInitialPrompt = (): PromptMessage[] => {
    if (p.prompt) {
      const exercise = !!p.exercise?.answers.includes('prompt');
      if (exercise) {
        if (p.exercise?.initialPrompt) {
          return p.exercise.initialPrompt.map((m) => ({ ...m }));
        } else {
          return p.prompt.map((m) => ({ ...m, content: '' }));
        }
      }
      return p.prompt.map((m) => ({ ...m }));
    }

    const exercise = !!p.exercise?.answers.includes('user');
    const content = exercise ? p.exercise?.initialUser : p.user;
    return [{ role: 'user', content: content ?? '' }];
  };
  const [prompt, setPrompt] = useState<PromptMessage[]>(getInitialPrompt);
  const getInitialInput = (): Params[] => {
    const input = p.input ? (Array.isArray(p.input) ? p.input : [p.input]) : [];
    return input.map((params) => ({ ...params }));
  };
  const [input, setInput] = useState(getInitialInput);
  const [waiting, setWaiting] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);

  /* computed properties */

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

    const messages = prompt.map((p) => ({ ...p })); // clone
    !!input.length &&
      Object.entries(input[0]).forEach(([k, v]) => {
        messages.forEach((m) => {
          m.content = m.content.replaceAll(`{{${k}}}`, v);
        });
      });

    playgroundStore.setState({ assistant: [], metric: null });

    const abort = new AbortController();
    ref.current.abort = abort;

    await chat({
      messages,
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
    setInput(getInitialInput);
    playgroundStore.setState({ assistant: [], metric: null });
    handleDone();
    setAnswer(null);
  };
  const handleReaderMode = () => p.toggleInteractive();

  /* handlers */

  const handleContentChange = (content: string, i: number) => {
    const varRegex = /{{([^}]+)}}/g;
    const vars = content.match(varRegex)?.map((v) => v.slice(2, -2)) ?? [];

    const oldParams: Params = { ...input[0] };
    const params: Params = {};
    vars.forEach((k) => (params[k] = oldParams[k] ?? ''));

    const disabled = !!p.exercise && questionFields.includes('input');
    !disabled && setInput([params]);

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

      <div className={s.prompt}>
        {prompt.map((m, i) => (
          <TextArea
            key={i}
            className={s.user}
            isDisabled={!!p.exercise && questionFields.includes('prompt')}
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
        {!!input.length && (
          <Params
            id={id}
            disabled={!!p.exercise && questionFields.includes('input')}
            params={input[0]}
            updateParams={(params) => {
              const i = 0; // TODO: support multiple params (input)

              setInput((input) => [
                ...input.slice(0, i),
                params,
                ...input.slice(i + 1),
              ]);
            }}
          />
        )}

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

interface ParamsProps {
  id: string;
  disabled: boolean;
  params: Params;
  updateParams: (params: Params) => void;
  label?: string;
}

const Params = ({
  id,
  disabled,
  params,
  updateParams,
  label = 'input',
}: ParamsProps) => {
  return (
    <div className={s.params}>
      <div className={s.label}>{label}</div>

      <div className={s['params-grid']}>
        {Object.entries(params).map(([k, v]) => (
          <React.Fragment key={k}>
            <Label
              className={s['param-key']}
              id={`${id}-${k}-label`}
              htmlFor={`${id}-${k}-value`}
            >
              {k}
            </Label>

            <TextArea
              key={k}
              className={s['param-value']}
              isDisabled={disabled}
              aria-labelledby={`${id}-${k}-label`}
              id={`${id}-${k}-value`}
              onChange={(v) => {
                updateParams({ ...params, [k]: v });
              }}
              rows={1}
              placeholder={`Enter the value for ${k} here...`}
              value={v}
            />
          </React.Fragment>
        ))}
      </div>
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
