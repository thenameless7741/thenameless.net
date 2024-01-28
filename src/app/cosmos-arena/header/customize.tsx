import { X } from '@phosphor-icons/react/dist/ssr';

import Button from '@/ui/button';
import Checkbox from '@/ui/checkbox';
import CheckboxGroup from '@/ui/checkbox-group';
import LabelButton from '@/ui/label-button';
import { iconProps } from '@/ui/icon';
import { hfStore } from '../store';
import { headers as allHeaders } from './form-data';
import s from './dialog.module.scss';

interface Props {
  close: () => void;
}

const Customize = ({ close }: Props) => {
  const headers = hfStore((s) => s.headers);
  const resetHeaders = hfStore((s) => s.resetHeaders);

  return (
    <div className={s.dialog}>
      <form className={s.form}>
        <header className={s.header}>
          <Button className={s.close} onPress={close}>
            <X {...iconProps} />
          </Button>

          <div className={s.heading}>Customize</div>
        </header>

        <hr className={s.hr} />

        <main className={s.main}>
          <CheckboxGroup
            label="Visible Columns"
            /* @ts-ignore incorrect RAC type */
            onChange={(headers) => hfStore.setState({ headers })}
            value={headers}
          >
            <Checkbox className={s.checkbox} isDisabled value="Model">
              Model
            </Checkbox>

            <Checkbox className={s.checkbox} isDisabled value="Average">
              Average
            </Checkbox>

            {allHeaders.slice(2).map((h) => (
              <Checkbox key={h} className={s.checkbox} value={h}>
                {h}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </main>

        <hr className={s.hr} />

        <footer className={s.footer}>
          <LabelButton onPress={resetHeaders}>reset</LabelButton>
          <LabelButton onPress={close}>Close</LabelButton>
        </footer>
      </form>
    </div>
  );
};
export default Customize;
