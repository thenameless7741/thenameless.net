import { X } from '@phosphor-icons/react/dist/ssr/X';

import Button from '@/ui/button';
import Stellula from './stellula';
import s from './stellula-dialog.module.scss';

interface Props {
  path: string;
  title: string;
  close: () => void;
}

const StellulaDialog = ({ path, title, close }: Props) => {
  return (
    <div className={s['stellula-dialog']}>
      <header className={s.header}>
        <Button className={s.close} onPress={close}>
          <X size={24} weight="bold" />
        </Button>

        <span className={s.title}>{title}</span>
      </header>

      {<Stellula path={path} />}
    </div>
  );
};
export default StellulaDialog;
