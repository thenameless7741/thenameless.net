import { Checkbox, CheckboxProps } from 'react-aria-components';

import s from './checkbox.module.scss';

type Props = CheckboxProps & {
  children?: React.ReactNode; // override
};

const Component = ({ children, className, ...props }: Props) => {
  return (
    <Checkbox {...props} className={[s.wrapper, className ?? ''].join(' ')}>
      <div className={s.checkbox} aria-hidden="true">
        <svg viewBox="0 0 19 19">
          <polyline points="3 10 8 14 16 6" />
        </svg>
      </div>

      <span className={s.label}>{children}</span>
    </Checkbox>
  );
};
export default Component;
