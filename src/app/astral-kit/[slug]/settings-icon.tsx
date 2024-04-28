'use client';

import { GearSix } from '@phosphor-icons/react/dist/ssr';

import Dialog, { DialogTrigger, Modal } from '@/ui/dialog';
import IconButton from '@/ui/icon-button';
import Tooltip, { TooltipTrigger } from '@/ui/tooltip';
import Settings from './settings';

import s from '@/ui/mdx/header.module.scss';

const SettingsIcon = () => {
  return (
    <DialogTrigger>
      <TooltipTrigger>
        <IconButton className={s.settings} Icon={GearSix} />

        <Tooltip>Settings</Tooltip>
      </TooltipTrigger>

      <Modal>
        <Dialog>{({ close }) => <Settings close={close} />}</Dialog>
      </Modal>
    </DialogTrigger>
  );
};
export default SettingsIcon;
