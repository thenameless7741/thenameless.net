import Link from '@/ui/link';

import { Resource as Props } from '@/types/mdx';
import s from './resource.module.scss';

const Resource = (r: Props) => {
  return (
    <div className={s.resource}>
      <div className={s.main}>
        <Link className={s.content} href={r.content.url}>
          {r.content.text}
        </Link>

        {!!r.description && `: ${r.description}`}

        {!!r.extras && (
          <span className={s.extras}>
            {r.extras.map((e, i) => (
              <span key={e.url}>
                {`   |   `}
                <Link href={e.url}>{e.text}</Link>
              </span>
            ))}
          </span>
        )}
      </div>

      {(!!r.author || !!r.tags) && (
        <div className={s.metadata}>
          {!!r.author &&
            (r.author?.url ? (
              <Link className={s.author} href={r.author.url}>
                {r.author.text}
              </Link>
            ) : (
              <span className={s.author}>{r.author.text}</span>
            ))}

          {!!r.tags && (
            <div className={s.tags}>
              {r.tags.map((t) => (
                <span key={t} className={s.tag}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Resource;
