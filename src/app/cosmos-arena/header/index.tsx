import { Faders, FunnelSimple } from '@phosphor-icons/react/dist/ssr';
import { Dialog, DialogTrigger, Modal } from 'react-aria-components';

import BorderButton from '@/ui/border-button';
import SearchField from '@/ui/search-field';
import store from '../store';
import Customize from './customize';
import Filter from './filter';
import s from './index.module.scss';

const Header = () => {
  return (
    <header className={s.header}>
      <div className={s.form}>
        <SearchField
          className={s.search}
          aria-label="search"
          onChange={(search) => store.setState({ search })}
          onClear={() => store.setState({ search: '' })}
          /* @ts-ignore TODO: implement description */
          placeholder="Enter model keywords, e.g. mistral, dpo"
          type="text" /* search (default) is difficult to style */
        />

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
      </div>
    </header>
  );
};
export default Header;
