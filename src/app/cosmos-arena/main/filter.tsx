import { ArrowClockwise } from '@phosphor-icons/react/dist/ssr';
import { useEffect, useTransition } from 'react';

import Checkbox from '@/ui/checkbox';
import CheckboxGroup from '@/ui/checkbox-group';
import IconLabelButton from '@/ui/icon-label-button';
import { hfStore } from '../store';
import {
  architectureGroups as allArchitectureGroups,
  licenseGroups as allLicenseGroups,
  paramGroups as allParamGroups,
  weightTypes as allWeightTypes,
  precisions as allPrecisions,
  types as allTypes,
} from '../header/form-data';
import s from './filter.module.scss';

const Filter = () => {
  const models = hfStore((s) => s.models);
  const types = hfStore((s) => s.types);
  const weightTypes = hfStore((s) => s.weightTypes);
  const precisions = hfStore((s) => s.precisions);
  const licenseGroups = hfStore((s) => s.licenseGroups);
  const paramGroups = hfStore((s) => s.paramGroups);
  const architectureGroups = hfStore((s) => s.architectureGroups);
  const exclusions = hfStore((s) => s.exclusions);
  const search = hfStore((s) => s.search);

  const [_, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      let ms = models;

      if (types.length > 0) {
        ms = ms.filter((m) => types.includes(m.type));
      }
      if (weightTypes.length > 0) {
        ms = ms.filter((m) => weightTypes.includes(m.weightType));
      }
      if (precisions.length > 0) {
        ms = ms.filter((m) => precisions.includes(m.precision));
      }
      if (licenseGroups.length > 0) {
        ms = ms.filter((m) => licenseGroups.includes(m.licenseGroup));
      }
      if (paramGroups.length > 0) {
        ms = ms.filter((m) => paramGroups.includes(m.paramGroup));
      }
      if (architectureGroups.length > 0) {
        ms = ms.filter((m) => architectureGroups.includes(m.architectureGroup));
      }
      if (exclusions.merged) {
        ms = ms.filter((m) => !m.merged);
      }
      if (exclusions.flagged) {
        ms = ms.filter((m) => !m.flagged);
      }
      if (exclusions.moe) {
        ms = ms.filter((m) => !m.moe);
      }

      hfStore.setState({ filteredModels: ms });
    });
  }, [
    models,
    types,
    weightTypes,
    precisions,
    licenseGroups,
    paramGroups,
    architectureGroups,
    exclusions,
    search,
  ]);

  return (
    <form className={s.form}>
      <main className={s.main}>
        <CheckboxGroup
          label="Types"
          /* @ts-ignore incorrect RAC type */
          onChange={(types) => hfStore.setState({ types })}
          value={types}
        >
          {allTypes.map((t) => (
            <Checkbox key={t} value={t}>
              {t || 'n/a'}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <hr className={s.hr} />

        <CheckboxGroup
          label="Weight Types"
          /* @ts-ignore incorrect RAC type */
          onChange={(weightTypes) => hfStore.setState({ weightTypes })}
          value={weightTypes}
        >
          {allWeightTypes.map((wt) => (
            <Checkbox key={wt} value={wt}>
              {wt || 'n/a'}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <hr className={s.hr} />

        <CheckboxGroup
          label="Precisions"
          /* @ts-ignore incorrect RAC type */
          onChange={(precisions) => hfStore.setState({ precisions })}
          value={precisions}
        >
          {allPrecisions.map((p) => (
            <Checkbox key={p} value={p}>
              <code>{p || 'n/a'}</code>
            </Checkbox>
          ))}
        </CheckboxGroup>

        <hr className={s.hr} />

        <CheckboxGroup
          label="Licenses"
          /* @ts-ignore incorrect RAC type */
          onChange={(licenseGroups) => hfStore.setState({ licenseGroups })}
          value={licenseGroups}
        >
          {allLicenseGroups.map((lg) => (
            <Checkbox key={lg} value={lg}>
              {lg || 'n/a'}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <hr className={s.hr} />

        <CheckboxGroup
          label="Params (B)"
          /* @ts-ignore incorrect RAC type */
          onChange={(paramGroups) => hfStore.setState({ paramGroups })}
          value={paramGroups}
        >
          {allParamGroups.map((pg) => (
            <Checkbox key={pg} value={pg}>
              {pg === '0' ? 'n/a' : pg}
            </Checkbox>
          ))}
        </CheckboxGroup>

        <hr className={s.hr} />

        <CheckboxGroup
          label="Architectures"
          onChange={(architectureGroups) =>
            /* @ts-ignore incorrect RAC type */
            hfStore.setState({ architectureGroups })
          }
          value={architectureGroups}
        >
          {allArchitectureGroups.map((ag) => (
            <Checkbox key={ag} value={ag}>
              <code>{ag}</code>
            </Checkbox>
          ))}
        </CheckboxGroup>

        <hr className={s.hr} />

        <section className={s.group}>
          <span className={s['group-label']}>Exclusions</span>

          <div className={s['group-fields']}>
            <Checkbox
              isSelected={exclusions.merged}
              onChange={(merged) => {
                hfStore.setState({ exclusions: { ...exclusions, merged } });
              }}
            >
              merged
            </Checkbox>

            <Checkbox
              isSelected={exclusions.flagged}
              onChange={(flagged) => {
                hfStore.setState({ exclusions: { ...exclusions, flagged } });
              }}
            >
              flagged
            </Checkbox>

            <Checkbox
              isSelected={exclusions.moe}
              onChange={(moe) => {
                hfStore.setState({ exclusions: { ...exclusions, moe } });
              }}
            >
              MoE
            </Checkbox>
          </div>
        </section>

        <hr className={s.hr} />
      </main>

      <footer className={s.footer}>
        <IconLabelButton
          Icon={ArrowClockwise}
          onPress={() => {
            hfStore.setState({
              types: [],
              weightTypes: [],
              precisions: [],
              licenseGroups: [],
              paramGroups: [],
              architectureGroups: [],
              exclusions: {
                merged: true,
                flagged: true,
                moe: false,
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
export default Filter;
