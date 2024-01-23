import { Icon as PhosphorIcon, IconProps } from '@phosphor-icons/react';
import { Button, ButtonProps } from 'react-aria-components';

import { iconProps } from './icon';
import s from './icon-button.module.scss';

type Props = ButtonProps & {
  Icon: PhosphorIcon;
  weight?: IconProps['weight'];
};

const Component = ({ Icon, weight, className, ...props }: Props) => {
  return (
    <Button {...props} className={[s.button, className ?? ''].join(' ')}>
      <Icon {...iconProps} weight={weight} className={s.icon} />
    </Button>
  );
};
export default Component;
