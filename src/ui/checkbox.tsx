import { useId } from 'react-aria';
import {
  Checkbox,
  CheckboxContext,
  CheckboxProps,
} from 'react-aria-components';

import s from './checkbox.module.scss';

type Props = CheckboxProps & {
  children?: React.ReactNode; // override
  description?: React.ReactNode;
};

const Component = ({ description, ...props }: Props) => {
  return description ? (
    <DescriptionWrapper description={description}>
      <Base {...props} />
    </DescriptionWrapper>
  ) : (
    <Base {...props} />
  );
};
export default Component;

const Base = ({ children, className, ...props }: Props) => {
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

interface DescriptionProps {
  children: React.ReactNode;
  description?: React.ReactNode;
}
const DescriptionWrapper = ({ description, children }: DescriptionProps) => {
  const descriptionId = useId();

  return (
    <div className={s['description-wrapper']}>
      <CheckboxContext.Provider value={{ 'aria-describedby': descriptionId }}>
        {children}
      </CheckboxContext.Provider>

      <small id={descriptionId} className={s.description}>
        {description}
      </small>
    </div>
  );
};
