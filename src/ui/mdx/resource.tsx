import { Resource as Props } from '@/types/mdx';
import Link from '@/ui/link';
import s from './resource.module.scss';
import StellulaTrigger from './stellula-trigger';

const Resource = (r: Props) => {
  const separator = `   |   `;

  return (
    <div className={s.resource}>
      <div className={s.main}>
        <Link className={s.content} href={r.content.url}>
          {r.content.text}
        </Link>

        {!!r.description && `: ${r.description}`}

        {(!!r.extras || !!r.summary) && (
          <span className={s.extras}>
            {r.extras?.map((e) => (
              <span key={e.url}>
                {separator}
                <Link href={e.url}>{e.text}</Link>
              </span>
            ))}

            {!!r.summary && (
              <span className={s.summary}>
                {separator}
                <StellulaTrigger path={r.summary} title="Summary">
                  Summary
                </StellulaTrigger>
              </span>
            )}
          </span>
        )}
      </div>

      {(!!r.author || !!r.tags) && (
        <div className={s.metadata}>
          {!!r.author &&
            (r.author?.url ? (
              <span>
                by:&nbsp;
                <Link className={s.author} href={r.author.url}>
                  {r.author.text}
                </Link>
              </span>
            ) : (
              <span className={s.author}>by: {r.author.text}</span>
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
