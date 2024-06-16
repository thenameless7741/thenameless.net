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
      <Button className={s.trigger}>{children}</Button>

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
