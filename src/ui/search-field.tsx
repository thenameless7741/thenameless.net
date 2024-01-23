import {
  Button,
  Input,
  Label,
  SearchField,
  SearchFieldProps,
  Text,
} from 'react-aria-components';
import { MagnifyingGlass, XCircle } from '@phosphor-icons/react/dist/ssr';

import Border from '@/ui/border';
import { iconProps } from '@/ui/icon';
import s from './search-field.module.scss';

type Props = SearchFieldProps & {
  label?: string;
  description?: string;
  error?: string;
};

const Component = ({
  label,
  description,
  error,
  className,
  ...props
}: Props) => {
  return (
    <SearchField {...props} className={[s.search, className ?? ''].join(' ')}>
      {({ state }) => (
        <>
          <Border />

          <Label className={s.label}>
            <MagnifyingGlass {...iconProps} />
            {label}
          </Label>

          <Input className={s.input} />

          {state.value !== '' && (
            <Button className={s.clear}>
              <XCircle {...iconProps} weight="fill" />
            </Button>
          )}

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
        </>
      )}
    </SearchField>
  );
};
export default Component;
