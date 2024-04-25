'use client';

import { CaretLeft, CaretUp } from '@phosphor-icons/react/dist/ssr';

import Link from '@/ui/link';
import IconLabelButton from '../icon-label-button';
import s from './pagination.module.scss';

interface Props {
  prev?: NavData;
  next?: NavData;
  top?: NavData;
}

interface NavData {
  href: string;
  title: string;
  subtitle?: string;
}

const Pagination = ({ prev, next, top }: Props) => {
  if (!prev && !next) return null;

  return (
    <div className={s.pagination}>
          <IconLabelButton
        className={s.scroll}
        Icon={CaretUp}
        onPress={() => window.scrollTo({ behavior: 'smooth', top: 0 })}
        size={14}
      >
        Scroll to Top
      </IconLabelButton>

      {!!prev && <NavCard {...prev} role="prev" />}
      {!!next && <NavCard {...next} role="next" />}

      {!!top && (
        <Link className={s.top} href={top.href}>
          <CaretLeft size={14} weight="bold" />
          {top.title}
        </Link>
      )}
    </div>
  );
};
export default Pagination;

const NavCard = (p: NavData & { role: 'prev' | 'next' }) => {
  return (
    <Link className={s[p.role]} href={p.href}>
      <div className={s.label}>{p.role}</div>

      <div className={s.title}>{p.title}</div>

      {!!p.subtitle && <div className={s.subtitle}>{p.subtitle}</div>}
    </Link>
  );
};
