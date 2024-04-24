import Link from '@/ui/link';
import { Heading } from '@/types/mdx';
import s from './toc.module.scss';

interface Props {
  headings: Heading[];
  depth?: number;
}

const TOC = ({ headings, depth = 2 }: Props) => {
  if (headings.length === 0) return null;

  return (
    <div className={s.toc}>
      <div className={s.label}>Table of Contents</div>

      <div className={s.content}>
        {headings.map((h2) => (
          <div key={h2.text}>
            <div className={s.h2}>
              <Link href={toFragment(h2.text)}>{normalize(h2.text)}</Link>
            </div>

            {depth >= 1 &&
              h2.subHeadings?.map((h3) => (
                <div key={h3.text}>
                  <div className={s.h3}>
                    <Link href={toFragment(h3.text)}>{normalize(h3.text)}</Link>
                  </div>

                  {depth >= 2 &&
                    h3.subHeadings?.map((h4) => (
                      <div key={h4.text}>
                        <div className={s.h4}>
                          <Link href={toFragment(h4.text)}>
                            {normalize(h4.text)}
                          </Link>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export default TOC;

const toFragment = (text: string) => {
  return (
    '#' +
    encodeURIComponent(
      text.toLowerCase().replace(/[ ]/g, '-').replace(/[`]/g, ''),
    )
  );
};

const normalize = (text: string): string => {
  return text.replace(/[`]/g, '');
};
