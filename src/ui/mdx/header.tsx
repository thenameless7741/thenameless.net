import { Metadata } from '@/types/mdx';
import s from './header.module.scss';

interface Props {
  data: { [key: string]: any };
}

const Header = ({ data }: Props) => {
  const m = data as Metadata;

  return (
    <header className={s.header}>
      <div className={s['type-stage']}>
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
