'use client';

import { Circle, PushPin, X } from '@phosphor-icons/react/dist/ssr';
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from 'react-aria-components';

import IconButton from '@/ui/icon-button';

import Info from '@/ui/info';
import Link from '@/ui/link';
import { headerDescriptions } from '../header/form-data';
import store from '../store';
import { key } from '../utils';
import type { Header, Model } from '../types';
import s from './model-table.module.scss';

interface Props {
  models: Model[];
  headers: Header[];
  meta: {
    total: number;
    topKeys: {
      // relative to filtered models
      average: string;
      arc: string;
      hellaswag: string;
      mmlu: string;
      truthfulqa: string;
      winogrande: string;
      gsm8k: string;
    };
  };
  showPin?: boolean;
  sticky?: boolean;
}

const ModelTable = ({
  models,
  headers,
  meta,
  showPin = false,
  sticky = false,
}: Props) => {
  const pins = store((s) => s.pins);
  const togglePin = store((s) => s.togglePin);

  // affects column ordering
  const activeHeaders: { [k in Header]: boolean } = {
    Model: true,
    Params: false,
    Average: false,
    MMLU: false,
    ARC: false,
    GSM8k: false,
    HellaSwag: false,
    TruthfulQA: false,
    Winogrande: false,
    Type: false,
    Architecture: false,
    'Weight Type': false,
    Precision: false,
    Merged: false,
    License: false,
    Likes: false,
    'On Hub': false,
    SHA: false,
    Flagged: false,
    MoE: false,
  };
  headers.forEach((h) => (activeHeaders[h] = true));
  const actives = Object.entries(activeHeaders).filter(
    ([h, active]) => active, // omit cached deprecated headers
  ) as [Header, boolean][];

  const round = (n: number) => Math.round(n * 10) / 10; // 1 decimal place

  const { total, topKeys } = meta;
  const pinnedKeySet = new Set(pins);

  return (
    <>
      <Table className={s.table} aria-label="Models">
        <TableHeader>
          {actives.map(([header, _], i) => (
            <Column
              key={header}
              className={[s.header, i == 0 && sticky ? s.sticky : ''].join(' ')}
              isRowHeader={i === 0}
            >
              {headerDescriptions[header] ? (
                <span className={s['header-content']}>
                  {header}
                  <Info>{headerDescriptions[header]}</Info>
                </span>
              ) : (
                header
              )}
            </Column>
          ))}

          {showPin && <Column className={s.header} />}
        </TableHeader>

        <TableBody
          renderEmptyState={() => (
            <p className={s.empty}>
              No results found.{'\n'}Adjust the filter or try a different model
              name.
            </p>
          )}
        >
          {models.map((m) => {
            const k = key(m);
            const pinned = pinnedKeySet.has(k);
            // exceptions: baseline, gpt2, gpt2-large, gpt2-medium, gpt2-xl
            const hf = m.name.includes('/');
            const name = hf ? m.name.split('/')[1] : m.name;
            const type = m.type === '' ? 'n/a' : m.type;
            const architecture = m.architecture === '' ? 'n/a' : m.architecture;
            const weightType = m.weightType === '' ? 'n/a' : m.weightType;
            const precision = m.precision === '' ? 'n/a' : m.precision;
            const license = m.license === '' ? 'n/a' : m.license;
            const param = m.param === 0 ? 'n/a' : `${round(m.param)}B`;
            const sha = m.sha === '' ? 'n/a' : m.sha.slice(0, 7);

            return (
              // pinned is added to force a re-render when the value has changed
              <Row key={k + '.' + pinned} className={s.row}>
                {hf ? (
                  <Cell className={[s.model, sticky ? s.sticky : ''].join(' ')}>
                    <Link
                      href={`https://huggingface.co/${m.name}`}
                      showIcon={false}
                    >
                      {name}
                    </Link>
                  </Cell>
                ) : (
                  <Cell className={s.model}>{name}</Cell>
                )}
                {activeHeaders['Params'] && (
                  <Cell className={s.body}>{param}</Cell>
                )}
                {activeHeaders['Average'] && (
                  <Cell className={topKeys.average === k ? s.top : s.value}>
                    {round(m.average)}
                  </Cell>
                )}
                {activeHeaders['MMLU'] && (
                  <Cell className={topKeys.mmlu === k ? s.top : s.value}>
                    {round(m.mmlu)}
                  </Cell>
                )}
                {activeHeaders['ARC'] && (
                  <Cell className={topKeys.arc === k ? s.top : s.value}>
                    {round(m.arc)}
                  </Cell>
                )}
                {activeHeaders['GSM8k'] && (
                  <Cell className={topKeys.gsm8k === k ? s.top : s.value}>
                    {round(m.gsm8k)}
                  </Cell>
                )}
                {activeHeaders['HellaSwag'] && (
                  <Cell className={topKeys.hellaswag === k ? s.top : s.value}>
                    {round(m.hellaswag)}
                  </Cell>
                )}
                {activeHeaders['TruthfulQA'] && (
                  <Cell className={topKeys.truthfulqa === k ? s.top : s.value}>
                    {round(m.truthfulqa)}
                  </Cell>
                )}
                {activeHeaders['Winogrande'] && (
                  <Cell className={topKeys.winogrande === k ? s.top : s.value}>
                    {round(m.winogrande)}
                  </Cell>
                )}

                {activeHeaders['Type'] && (
                  <Cell className={s.body}>{type}</Cell>
                )}
                {activeHeaders['Architecture'] && (
                  <Cell className={s.body}>{architecture}</Cell>
                )}
                {activeHeaders['Weight Type'] && (
                  <Cell className={s.body}>{weightType}</Cell>
                )}
                {activeHeaders['Precision'] && (
                  <Cell className={s.code}>{precision}</Cell>
                )}
                {activeHeaders['Merged'] && (
                  <Cell className={s.body}>{formatBoolean(m.merged)}</Cell>
                )}
                {activeHeaders['License'] && (
                  <Cell className={s.body}>{license}</Cell>
                )}
                {activeHeaders['Likes'] && (
                  <Cell className={s.body}>{m.like}</Cell>
                )}
                {activeHeaders['On Hub'] && (
                  <Cell className={s.body}>
                    {m.onHub === '' ? 'n/a' : formatBoolean(!!m.onHub)}
                  </Cell>
                )}
                {activeHeaders['SHA'] && <Cell className={s.code}>{sha}</Cell>}
                {activeHeaders['Flagged'] && (
                  <Cell className={s.body}>{formatBoolean(m.flagged)}</Cell>
                )}
                {activeHeaders['MoE'] && (
                  <Cell className={s.body}>{formatBoolean(m.moe)}</Cell>
                )}

                {showPin && (
                  <Cell className={pinned ? s['pin-active'] : s.pin}>
                    <IconButton
                      Icon={PushPin}
                      weight={pinned ? 'fill' : 'bold'}
                      onPress={() => togglePin(k)}
                    />
                  </Cell>
                )}
              </Row>
            );
          })}

          {/* TODO: use caption/tfoot when implemented */}
          {models.length > 0 && (
            <Row className={s.row}>
              <Cell className={s.total}>
                Displaying 1-{models.length} of {total} models
              </Cell>

              {Array.from(
                { length: actives.length - (showPin ? 0 : 1) },
                (_, i) => (
                  <Cell key={i} className={s.total} />
                ),
              )}
            </Row>
          )}
        </TableBody>
      </Table>
    </>
  );
};
export default ModelTable;

const formatBoolean = (v: boolean) => {
  const Icon = v ? Circle : X;
  return <Icon size={14} weight="bold" />;
};