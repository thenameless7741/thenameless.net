import { Info } from '@phosphor-icons/react/dist/ssr';

import Tooltip, { TooltipTrigger } from '@/ui/tooltip';
import IconButton from './icon-button';
import s from './info.module.scss';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Component = ({ children, className }: Props) => {
  return (
    <TooltipTrigger delay={500}>
      <IconButton
        className={[s.button, className ?? ''].join(' ')}
        weight="bold"
        Icon={Info}
      />
      <Tooltip className={s.tooltip}>{children}</Tooltip>
    </TooltipTrigger>
  );
};
export default Component;
