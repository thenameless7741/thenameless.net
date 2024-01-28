import { ArrowClockwise } from '@phosphor-icons/react/dist/ssr';
import { useEffect, useTransition } from 'react';

import Checkbox from '@/ui/checkbox';
import IconLabelButton from '@/ui/icon-label-button';
import { lmsysStore } from '../store';
import s from './hf-filter.module.scss';

const LMSYSFilter = () => {
  const models = lmsysStore((s) => s.models);
  const onHub = lmsysStore((s) => s.onHub);
  const exclusions = lmsysStore((s) => s.exclusions);

  const [_, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      let ms = models;

      if (onHub) {
        ms = ms.filter((m) => m.onHub);
      }
      if (exclusions.toolUse) {
        ms = ms.filter((m) => !m.toolUse);
      }

      lmsysStore.setState({ filteredModels: ms });
    });
  }, [models, onHub, exclusions]);

  return (
    <form className={s.form}>
      <main className={s.main}>
        <section className={s.group}>
          <div className={s['group-fields']}>
            <Checkbox
              isSelected={onHub}
              onChange={(onHub) => {
                lmsysStore.setState({ onHub });
              }}
            >
              on Hub
            </Checkbox>
          </div>
        </section>

        <hr className={s.hr} />

        <section className={s.group}>
          <span className={s['group-label']}>Exclusions</span>

          <div className={s['group-fields']}>
            <Checkbox
              isSelected={exclusions.toolUse}
              onChange={(toolUse) => {
                lmsysStore.setState({ exclusions: { ...exclusions, toolUse } });
              }}
            >
              tool-use
            </Checkbox>
          </div>
        </section>

        <hr className={s.hr} />
      </main>

      <footer className={s.footer}>
        <IconLabelButton
          Icon={ArrowClockwise}
          onPress={() => {
            lmsysStore.setState({
              onHub: false,
              exclusions: {
                toolUse: true,
              },
            });
          }}
        >
          Reset Filter
        </IconLabelButton>
      </footer>
    </form>
  );
};
export default LMSYSFilter;
