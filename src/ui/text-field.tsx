import {
  InputProps,
  TextFieldProps,
  ValidationResult,
} from 'react-aria-components';
import {
  FieldError,
  Input,
  Label,
  Text,
  TextField,
} from 'react-aria-components';

import s from './text-field.module.scss';

type Props = TextFieldProps & {
  label?: string;
  placeholder?: string;
  spellCheck?: InputProps['spellCheck'];
  description?: React.ReactNode;
  errorMessage?: string | ((validation: ValidationResult) => string);
};

const Component = ({
  label,
  placeholder,
  spellCheck,
  description,
  errorMessage,
  className,
  ...props
}: Props) => {
  return (
    <TextField {...props} className={[s.container, className ?? ''].join(' ')}>
      {!!label && <Label className={s.label}>{label}</Label>}

      <Input
        className={s.input}
        placeholder={placeholder}
        spellCheck={spellCheck}
      />

      {!!description && (
        <Text className={s.description} slot="description">
          {description}
        </Text>
      )}

      {!!errorMessage && (
        <FieldError className={s.error}>{errorMessage}</FieldError>
      )}
    </TextField>
  );
};
export default Component;
