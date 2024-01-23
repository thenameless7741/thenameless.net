import { CheckboxGroup, CheckboxGroupProps, Text } from 'react-aria-components';

import s from './checkbox-group.module.scss';

type Props = CheckboxGroupProps & {
  children?: React.ReactNode; // override
  label?: string;
  description?: string;
  error?: string;
};

const Component = ({
  children,
  label,
  description,
  error,
  className,
  ...props
}: Props) => {
  return (
    <CheckboxGroup {...props} className={[s.group, className ?? ''].join(' ')}>
      <span className={s.label}>{label}</span>

      <div className={s.checkboxes}>{children}</div>

      {/* TODO: implement description and error styling */}
      {!!description && !error && (
        <Text className={s.description} slot="description">
          {description}
        </Text>
      )}
      {!!error && (
        <Text className={s.error} slot="errorMessage">
          {error}
        </Text>
      )}
    </CheckboxGroup>
  );
};
export default Component;
