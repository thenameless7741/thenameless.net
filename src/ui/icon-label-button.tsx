import { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { Button, ButtonProps } from 'react-aria-components';

import { iconProps } from './icon';
import s from './icon-label-button.module.scss';

type Props = ButtonProps & {
  Icon: PhosphorIcon;
  children: React.ReactNode;
};

const Component = ({ Icon, children, className, ...props }: Props) => {
  return (
    <Button {...props} className={[s.button, className ?? ''].join(' ')}>
      <Icon {...iconProps} className={s.icon} />
      <span className={s.label}>{children}</span>
    </Button>
  );
};
export default Component;
