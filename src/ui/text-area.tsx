import { forwardRef, useEffect, useRef } from 'react';
import {
  FieldError,
  Label,
  Text,
  TextArea,
  TextField,
  TextFieldProps,
  ValidationResult,
} from 'react-aria-components';

// @ts-ignore type is unavailable
import autosize from './autosize';
import s from './text-area.module.scss';

type Props = TextFieldProps & {
  label?: string;
  placeholder?: string;
  rows?: number;
  description?: string;
  error?: string | ((validation: ValidationResult) => string);
};

const Component = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      label,
      placeholder,
      rows = 1,
      description,
      error,
      className,
      onChange,
      ...props
    }: Props,
    textAreaRef,
  ) => {
    const ref = useRef<HTMLTextAreaElement>(null);
    if (textAreaRef && 'current' in textAreaRef) {
      textAreaRef.current = ref.current;
    }

    useEffect(() => {
      // @ts-ignore type is not available
      autosize(ref.current);
      const node = ref.current;

      return () => {
        // @ts-ignore type is not available
        autosize.destroy(node);
      };
    }, []);

    return (
      <TextField
        {...props}
        className={[s.textfield, className ?? ''].join(' ')}
        onChange={(e) => {
          onChange && onChange(e);
        }}
      >
        {!!label && <Label className={s.label}>{label}</Label>}

        <TextArea
          ref={ref}
          className={s.textarea}
          autoCapitalize="off"
          autoComplete="off"
          placeholder={placeholder}
          rows={rows}
        />

        {!!description && (
          <Text className={s.description} slot="description">
            {description}
          </Text>
        )}

        {!!error && <FieldError className={s.error}>{error}</FieldError>}
      </TextField>
    );
  },
);
export default Component;
Component.displayName = 'TextArea';
