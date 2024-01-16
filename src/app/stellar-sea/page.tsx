import fs from 'fs';
import p from 'path';

import matter from 'gray-matter';

import { Metadata } from '@/types/mdx';
import Link from '@/ui/link';
import s from './page.module.scss';

const Page = async () => {
  const mdxDir = p.join(process.cwd(), 'src', 'mdx');
  const mdxRegExp = /\.mdx?$/;

  const paths = fs.readdirSync(mdxDir).filter((f) => mdxRegExp.test(f));

  const stellae = paths.map((path) => {
    const filePath = p.join(mdxDir, path);
    const source = fs.readFileSync(filePath).toString();
    const { data } = matter(source);

    return {
      slug: path.replace(mdxRegExp, ''),
      ...(data as Metadata),
    };
  });

  const stellaeByType = stellae.reduce(
    (map, s) => {
      const key = s.type;
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(s);
      return map;
    },
    {} as { [k in Metadata['type']]: typeof stellae },
  );

  return (
    <div className={s['stellar-sea']}>
      <h1 className={s.title}>stellar-sea</h1>

      {Object.entries(stellaeByType).map(([type, stellae]) => (
        <div key={type} className={s.stellae}>
          <h2 className={s.type}>{`${type}s`}</h2>

          <ul className={s.links}>
            {stellae.map(({ slug, ...m }) => (
              <li key={slug} className={s.link}>
                <Link href={`/stellar-sea/${slug}`}>{m.title}</Link>

                <div className={s['updated-at']}>{m.updatedAt}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default Page;
