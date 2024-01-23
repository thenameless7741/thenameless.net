import { ButtonProps } from 'react-aria-components';

import Border from '@/ui/border';
import Button from '@/ui/button';
import s from './border-button.module.scss';

type Props = ButtonProps & {
  children: React.ReactNode;
};

const Component = ({ className, children, ...props }: Props) => {
  return (
    <Button
      {...props}
      className={[s['border-button'], className ?? ''].join(' ')}
    >
      <Border />
      {children}
    </Button>
  );
};
export default Component;
