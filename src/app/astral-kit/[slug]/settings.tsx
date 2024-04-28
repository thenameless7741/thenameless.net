import { X } from '@phosphor-icons/react/dist/ssr';

import IconButton from '@/ui/icon-button';
import s from './settings.module.scss';

interface Props {
  close: () => void;
}

const Settings = ({ close }: Props) => {
  return (
    <div className={s.settings}>
      <div className={s.wrapper}>
        <header className={s.header}>
          <IconButton className={s.close} Icon={X} onPress={close} />
        </header>

        <main className={s.main}></main>
      </div>
    </div>
  );
};
export default Settings;
