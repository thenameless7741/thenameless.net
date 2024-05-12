import { Cube } from '@phosphor-icons/react/dist/ssr';
import React from 'react';
import Prism from 'react-syntax-highlighter/dist/esm/prism';

import prism from '@/styles/prism';
import IconLabelButton from '@/ui/icon-label-button';
import store from '../store';
import { PlaygroundProps as PP, Params } from './types';
import s from './non-interactive.module.scss';

type Props = PP.Base &
  PP.NonInteractive & {
    toggleInteractive: () => void;
  };

const NonInteractive = (p: Props) => {
  const hasKey = !!store(s => s.apiKey);

  let prompt = 'User: ' + p.user;
  if (p.prompt) {
    prompt = p.prompt
      .map((m) => {
        let c = m.content;

        if (m.role === 'user') {
          c = 'User: ' + c;
        } else if (m.role === 'assistant') {
          c = 'Assistant: ' + c;
        } // else, error

        return c;
      })
      .join('\n');
  }

  return (
    <div
      className={[
        s.playground,
        p.system ? s['has-system'] : '',
        p.input ? s['has-input'] : '',
      ].join(' ')}
    >
      {hasKey && <div className={s.header}>
        <IconLabelButton
          className={s.action}
          Icon={Cube}
          onPress={() => p.toggleInteractive()}
        >
          interactive mode
        </IconLabelButton>
      </div>}

      {!!p.system && (
        <div className={s.system}>
          <div className={s.label}>{p.labels?.system ?? 'system'}</div>
          <div className={s.content}>{p.system}</div>
        </div>
      )}

      <div className={s.user}>
        <div className={s.label}>{p.labels?.user ?? 'user'}</div>
        <Prism className={s.content} style={prism} language="django">
          {prompt}
        </Prism>
      </div>

      <div
        className={s.io}
        style={{ '--size': p.input?.length } as React.CSSProperties}
      >
        {!p.input ? null : Array.isArray(p.input) ? (
          p.input.map((params, i) => (
            <Params key={i} label={`input #${i + 1}`} params={params} />
          ))
        ) : (
          <Params params={p.input as Params} />
        )}

        {Array.isArray(p.assistant) ? (
          p.assistant.map((a, i) => (
            <Assistant
              key={i}
              label={`${p.labels?.assistant ?? 'assistant'}: #${i + 1}`}
              assistant={a}
            />
          ))
        ) : (
          <Assistant label={p.labels?.assistant} assistant={p.assistant} />
        )}
      </div>
    </div>
  );
};
export default NonInteractive;

const Params = ({
  label = 'input',
  params,
}: {
  label?: string;
  params: Params;
}) => {
  return (
    <div className={s.params}>
      <div className={s.label}>{label}</div>

      <div className={s['params-grid']}>
        {Object.entries(params).map(([k, v]) => (
          <React.Fragment key={k}>
            <div className={s['param-key']}>{k}</div>
            <div className={s['param-value']}>{v}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Assistant = ({
  label = 'assistant',
  assistant,
}: { label?: string } & Pick<Props, 'assistant'>) => {
  return (
    <div className={s.assistant}>
      <div className={s.label}>{label}</div>
      <div className={s.content}>{assistant}</div>
    </div>
  );
};
