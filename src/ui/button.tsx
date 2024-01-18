import { Button, ButtonProps } from 'react-aria-components';

import s from './button.module.scss';

type Props = ButtonProps & {
  children: React.ReactNode;
};

const Component = ({ children, className, ...props }: Props) => {
  return (
    <Button {...props} className={[s.button, className ?? ''].join(' ')}>
      {children}
    </Button>
  );
};
export default Component;
