import { CaretLeft } from '@phosphor-icons/react/dist/ssr';

import { Metadata } from '@/types/mdx';
import Link from '@/ui/link';
import SettingsIcon from './settings-icon';
import s from '@/ui/mdx/header.module.scss';

interface Props {
  data: { [key: string]: any };
}

const Header = ({ data }: Props) => {
  const m = data as Metadata;

  return (
    <header
      className={[s.header, m.subtitle ? s['has-subtitle'] : ''].join(' ')}
    >
      <div className={s.nav}>
        <Link className={s.back} href="/astral-kit">
          <CaretLeft className={s['back-icon']} size={14} weight="bold" />
          astral-kit
        </Link>
        <div className={s.type}>#{m.type}</div>
        <div className={s.stage}>#{m.stage}</div>
      </div>

      <SettingsIcon />

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
