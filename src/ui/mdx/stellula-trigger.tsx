'use client';

import { Dialog, DialogTrigger, Modal } from 'react-aria-components';

import Button from '@/ui/button';
import StellulaDialog from './stellula-dialog';
import s from './stellula-trigger.module.scss';

interface Props {
  path: string;
  title: string;
  children: React.ReactNode;
}

const StellulaTrigger = ({ path, title, children }: Props) => {
  return (
    <DialogTrigger>
      <Button className={s.trigger}>
        <Border />
        {children}
      </Button>

      <Modal>
        <Dialog>
          {({ close }) => (
            <StellulaDialog path={path} title={title} close={close} />
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};
export default StellulaTrigger;

const Border = () => {
  return (
    <span aria-hidden={true} className={s.border}>
      <div className={s['gap-1']} />
      <div className={s['gap-2']} />
      <div className={s['gap-3']} />
      <div className={s['gap-4']} />
    </span>
  );
};
