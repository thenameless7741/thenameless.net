import { X } from '@phosphor-icons/react/dist/ssr';

import Checkbox from '@/ui/checkbox';
import IconButton from '@/ui/icon-button';
import store from '../store';
import s from './settings.module.scss';

interface Props {
  close: () => void;
}

const Settings = ({ close }: Props) => {
  const interactive = store((s) => s.interactive);

  return (
    <div className={s.settings}>
      <div className={s.wrapper}>
        <header className={s.header}>
          <IconButton className={s.close} Icon={X} onPress={close} />
        </header>

        <main className={s.main}>
          <div className={s.wip}>Alpha Feature (work-in-progress)</div>

          <Checkbox
            className={s.checkbox}
            defaultSelected={interactive}
            onChange={(interactive) => store.setState({ interactive })}
          >
            Interactive Playground
          </Checkbox>
        </main>
      </div>
    </div>
  );
};
export default Settings;
