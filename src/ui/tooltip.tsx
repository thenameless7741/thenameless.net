import {
  OverlayArrow,
  Tooltip,
  TooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components';

import s from './tooltip.module.scss';

type Props = TooltipProps & {
  children: React.ReactNode;
  className?: string;
};

const Component = ({ children, className, ...props }: Props) => {
  return (
    <Tooltip {...props} className={[s.tooltip, className ?? ''].join(' ')}>
      <OverlayArrow className={s.overlay}>
        <svg width={8} height={8} viewBox="0 0 8 8">
          <path d="M0 0,L4 4,L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </Tooltip>
  );
};
export default Component;

export const TooltipTrigger = AriaTooltipTrigger;
