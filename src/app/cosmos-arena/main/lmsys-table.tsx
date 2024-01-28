'use client';

import { Circle, X } from '@phosphor-icons/react/dist/ssr';
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from 'react-aria-components';

import Info from '@/ui/info';
import Link from '@/ui/link';
import { headerDescriptions } from '../header/form-data';
import { lmsysStore } from '../store';
import { keys } from '../utils';
import { LMSYS } from '../types';
import s from './hf-table.module.scss';

interface Props {}

const LMSYSTable = ({}: Props) => {
  const models = lmsysStore((s) => s.models);
  const filteredModels = lmsysStore((s) => s.filteredModels);
  const onHub = lmsysStore((s) => s.onHub);

  const topKeys = calculateTopKeys(filteredModels);

  const headers: { [k in LMSYS.Header]: boolean } = {
    Model: true,
    Elo: true,
    Votes: true,
    Organization: true,
    License: true,
    'Tool-Use': true,
  };

  const actives = Object.entries(headers).filter(
    ([h, active]) => active, // omit cached deprecated headers
  ) as [LMSYS.Header, boolean][];

  return (
    <>
      <Table className={s.table} aria-label="Models">
        <TableHeader>
          {actives.map(([header, _], i) => (
            <Column
              key={header}
              className={[s.header, s['sticky-column']].join(' ')}
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
        </TableHeader>

        <TableBody
          renderEmptyState={() => (
            <p className={s.empty}>
              No results found.{'\n'}Adjust the filter or try a different model
              name.
            </p>
          )}
        >
          {filteredModels.map((m) => {
            const k = keys.lmsys(m);
            return (
              <Row key={k} className={s.row}>
                <Cell className={s['sticky-column']}>
                  {/* wrap content in div to adjust its width */}
                  <div className={s.model}>
                    <Link href={m.url} showIcon={!onHub}>
                      {m.name}
                    </Link>
                  </div>
                </Cell>

                {headers['Elo'] && (
                  <Cell className={topKeys.elo === k ? s.top : s.value}>
                    {m.elo}
                  </Cell>
                )}
                {headers['Votes'] && (
                  <Cell className={topKeys.votes === k ? s.top : s.value}>
                    {m.votes}
                  </Cell>
                )}
                {headers['Organization'] && (
                  <Cell className={s.value}>{m.organization}</Cell>
                )}
                {headers['License'] && (
                  <Cell className={s.value}>{m.license}</Cell>
                )}
                {headers['Tool-Use'] && (
                  <Cell className={s.body}>{formatBoolean(m.toolUse)}</Cell>
                )}
              </Row>
            );
          })}

          {/* TODO: use caption/tfoot when implemented */}
          {models.length > 0 && (
            <Row className={s.row}>
              <Cell className={s.total}>
                Displaying 1-{filteredModels.length} of {models.length} models
              </Cell>

              {Array.from({ length: actives.length - 1 }, (_, i) => (
                <Cell key={i} className={s.total} />
              ))}
            </Row>
          )}
        </TableBody>
      </Table>
    </>
  );
};
export default LMSYSTable;

const formatBoolean = (v: boolean) => {
  const Icon = v ? Circle : X;
  return <Icon size={14} weight="bold" />;
};

const top = (models: LMSYS.Model[], property: LMSYS.Sortable) =>
  models.reduce(
    /* @ts-ignore same hf-table */
    (top, m) => (m[property] > top[property] ? m : top),
    models[0] || '',
  );

const calculateTopKeys = (models: LMSYS.Model[]) => ({
  elo: keys.lmsys(top(models, 'elo')),
  votes: keys.lmsys(top(models, 'votes')),
});
