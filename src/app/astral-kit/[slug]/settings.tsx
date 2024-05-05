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
  const metric = store((s) => s.metric);

  return (
    <div className={s.settings}>
      <div className={s.wrapper}>
        <header className={s.header}>
          <IconButton className={s.close} Icon={X} onPress={close} />
        </header>

        <main className={s.main}>
          <div className={s.heading}>Settings</div>

          <Checkbox
            className={s.checkbox}
            defaultSelected={metric}
            onChange={(metric) => store.setState({ metric })}
          >
            Token usage & latency metrics
          </Checkbox>

          <div className={s.heading}>(work-in-progress)</div>

          <Checkbox
            className={s.checkbox}
            defaultSelected={interactive}
            onChange={(interactive) => store.setState({ interactive })}
          >
            Interactive playground
          </Checkbox>
        </main>
      </div>
    </div>
  );
};
export default Settings;
