import { Icon as PhosphorIcon, IconProps } from '@phosphor-icons/react';
import { Button, ButtonProps } from 'react-aria-components';

import { iconProps } from './icon';
import s from './icon-label-button.module.scss';

type Props = ButtonProps & {
  Icon: PhosphorIcon;
  size?: IconProps['size'];
  weight?: IconProps['weight'];
  children: React.ReactNode;
};

const Component = ({
  Icon,
  size = iconProps.size,
  weight = iconProps.weight,
  children,
  className,
  ...props
}: Props) => {
  return (
    <Button {...props} className={[s.button, className ?? ''].join(' ')}>
      <Icon {...iconProps} className={s.icon} size={size} weight={weight} />
      <span className={s.label}>{children}</span>
    </Button>
  );
};
export default Component;
