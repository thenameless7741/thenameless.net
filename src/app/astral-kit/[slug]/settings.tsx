import { TrashSimple, X } from '@phosphor-icons/react/dist/ssr';
import { useState } from 'react';

import Checkbox from '@/ui/checkbox';
import IconButton from '@/ui/icon-button';
import Link from '@/ui/link';
import TextField from '@/ui/text-field';
import { ToastProvider } from '@/ui/toast';
import Tooltip, { TooltipTrigger } from '@/ui/tooltip';
import { chat } from '../playground/api';
import store from '../store';
import s from './settings.module.scss';

interface Props {
  close: () => void;
}

const Settings = ({ close }: Props) => {
  const interactive = store((s) => s.interactive);
  const apiKey = store((s) => s.apiKey);
  const showMetric = store((s) => s.showMetric);

  const [apiKeyDraft, setAPIKeyDraft] = useState('');
  type KeyState = 'none' | 'validating' | 'invalid' | 'valid';
  const [keyState, setKeyState] = useState<KeyState>(apiKey ? 'valid' : 'none');

  return (
    <ToastProvider>
      {(toast) => {
        return (
          <div className={s.settings}>
            <div className={s.wrapper}>
              <header className={s.header}>
                <h1 className={s.title}>settings</h1>
                <IconButton className={s.close} Icon={X} onPress={close} />
              </header>

              <main className={s.main}>
                <Checkbox
                  className={s.interactive}
                  description=<>
                    To use this feature, you will need to obtain an API key from{' '}
                    <Link href="https://console.anthropic.com/">
                      Anthropic Console
                    </Link>
                  </>
                  defaultSelected={interactive}
                  onChange={(interactive) => store.setState({ interactive })}
                >
                  Interactive playground
                </Checkbox>

                <fieldset className={s.fields}>
                  {apiKey ? (
                    <div className={s['key-view']}>
                      <div className={s['key-view-label']}>API key</div>
                      <div className={s['key-view-value']}>
                        {`${apiKey.slice(0, 16)}...${apiKey.slice(-3)}`}
                        <TooltipTrigger>
                          <IconButton
                            className={s['key-view-remove']}
                            Icon={TrashSimple}
                            onPress={() => {
                              store.setState({ apiKey: '' });
                            }}
                          />

                          <Tooltip>Remove</Tooltip>
                        </TooltipTrigger>
                      </div>
                    </div>
                  ) : (
                    <div className={s['key-edit']}>
                      <TextField
                        className={s['key-input']}
                        autoComplete="off"
                        description="Your API key is stored locally in your browser and will never be shared with anyone else. As a general security best practice, consider creating a new key just for this tutorial, and delete it once you're done."
                        isDisabled={!interactive || keyState === 'validating'}
                        label="API key"
                        placeholder="Paste your key here, e.g., sk-ant-apixx-xxx"
                        spellCheck="false"
                        onChange={async (value) => {
                          setAPIKeyDraft(value);

                          if (value.length < 100) {
                            setKeyState('invalid');
                            return;
                          }

                          setKeyState('validating');

                          const success = () => {
                            setAPIKeyDraft('');
                            setKeyState('valid');
                            store.setState({ apiKey: value });

                            toast.add(<>API key successfully saved</>, {
                              timeout: 5_000,
                            });
                          };

                          const error = () => {
                            setKeyState('invalid');

                            toast.add(<>API key validation failed.</>, {
                              timeout: 5_000,
                            });
                          };

                          try {
                            let content = '';

                            await chat({
                              messages: [{ role: 'user', content: 'hi' }],
                              handleStream: (chunk) => {
                                content += chunk;
                                if (content.includes('authentication_error'))
                                  throw new Error();
                              },
                              apiKey: value,
                            });

                            success();
                          } catch (err) {
                            error();
                          }
                        }}
                        value={apiKeyDraft}
                      />

                      {keyState === 'validating' && (
                        <span className={s.validating}>validating...</span>
                      )}
                      {keyState === 'invalid' && (
                        <span className={s.invalid}>invalid</span>
                      )}
                    </div>
                  )}

                  <Checkbox
                    className={s['show-metric']}
                    defaultSelected={showMetric}
                    description="Claude's response will include details on the number of input and output tokens, as well as the time it took to generate the first token (TTFT) and the total time from end to end (E2E)."
                    isDisabled={!interactive}
                    onChange={(showMetric) => store.setState({ showMetric })}
                  >
                    Token usage & latency metrics
                  </Checkbox>
                </fieldset>
              </main>
            </div>
          </div>
        );
      }}
    </ToastProvider>
  );
};
export default Settings;
