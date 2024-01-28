import {
  ArrowsLeftRight,
  Faders,
  FunnelSimple,
} from '@phosphor-icons/react/dist/ssr';
import { useEffect } from 'react';
import { Dialog, DialogTrigger, Modal } from 'react-aria-components';

import BorderButton from '@/ui/border-button';
import SearchField from '@/ui/search-field';
import store, { hfStore, lmsysStore } from '../store';
import Customize from './customize';
import Filter from './filter';
import s from './index.module.scss';

const Header = () => {
  const arena = store((s) => s.arena);
  const updatedAt = hfStore((s) => s.updatedAt);

  useEffect(() => {
    if (arena === 'hf') {
      lmsysStore.setState({
        search: '',

        // filter
        onHub: false,
        exclusions: {
          toolUse: true,
        },
      });
    } else {
      hfStore.setState({
        search: '',

        // filter
        types: [],
        weightTypes: [],
        precisions: [],
        licenseGroups: [],
        paramGroups: [],
        architectureGroups: [],
        exclusions: {
          merged: true,
          flagged: true,
          moe: false,
        },
      });
    }
  }, [arena]);

  return (
    <header className={s.header}>
      <div className={s.form}>
        <div className={s.arena}>
          <h1 className={s.title}>
            {arena === 'hf' ? 'Open LLM' : 'Chatbot Arena'}
          </h1>

          <span className={s['updated-at']}>{updatedAt}</span>

          <BorderButton
            className={s.switch}
            onPress={() =>
              store.setState((curr) => ({
                arena: curr.arena === 'hf' ? 'lmsys' : 'hf',
              }))
            }
          >
            <ArrowsLeftRight size={14} weight="bold" />
            Arena
          </BorderButton>
        </div>

        {arena === 'hf' ? (
          <SearchField
            key={arena}
            className={s.search}
            aria-label="search"
            onChange={(search) => hfStore.setState({ search })}
            onClear={() => hfStore.setState({ search: '' })}
            /* @ts-ignore TODO: implement description */
            placeholder="Enter model keywords, e.g. mistral, dpo"
            type="text" /* search (default) is difficult to style */
          />
        ) : (
          <SearchField
            key={arena}
            className={s.search}
            aria-label="search"
            onChange={(search) => lmsysStore.setState({ search })}
            onClear={() => lmsysStore.setState({ search: '' })}
            /* @ts-ignore TODO: implement description */
            placeholder="Enter model keywords, e.g. gpt"
            type="text"
          />
        )}

        {arena == 'hf' && (
          <div className={s.icons}>
            <DialogTrigger>
              <BorderButton className={s.filter}>
                <FunnelSimple size={14} weight="bold" />
                Filter
              </BorderButton>

              <Modal>
                <Dialog>{({ close }) => <Filter close={close} />}</Dialog>
              </Modal>
            </DialogTrigger>
            <DialogTrigger>
              <BorderButton className={s.customize}>
                <Faders size={14} weight="bold" />
                Customize
              </BorderButton>

              <Modal>
                <Dialog>{({ close }) => <Customize close={close} />}</Dialog>
              </Modal>
            </DialogTrigger>
          </div>
        )}
      </div>
    </header>
  );
};
export default Header;
