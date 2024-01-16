import { CaretLeft } from '@phosphor-icons/react/dist/ssr';

import { Metadata } from '@/types/mdx';
import Link from '@/ui/link';
import s from './header.module.scss';

interface Props {
  data: { [key: string]: any };
}

const Header = ({ data }: Props) => {
  const m = data as Metadata;

  return (
    <header className={s.header}>
      <div className={s.nav}>
        <Link className={s.back} href="/stellar-sea">
          <CaretLeft className={s['back-icon']} size={14} weight="bold" />
          stellar-sea
        </Link>
        <div className={s.type}>#{m.type}</div>
        <div className={s.stage}>#{m.stage}</div>
      </div>

      <h1 className={s.title}>{m.title}</h1>
      {!!m.subtitle && <p className={s.subtitle}>{m.subtitle}</p>}

      <hr className={s.hr} />

      <div className={s.topics}>
        {m.topics.map((t) => (
          <div key={t} className={s.topic}>
            {t}
          </div>
        ))}
      </div>

      <div className={s['updated-at']}>
        <span className={s['updated-at-label']}>{`Last updated: `}</span>
        <span className={s['updated-at-value']}>{m.updatedAt}</span>
      </div>
    </header>
  );
};
export default Header;
