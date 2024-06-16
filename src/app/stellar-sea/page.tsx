import fs from 'fs';
import p from 'path';

import { compileMDX } from 'next-mdx-remote/rsc';

import { Metadata } from '@/types/mdx';
import Link from '@/ui/link';
import s from './page.module.scss';

const Page = async () => {
  const mdxDir = p.join(process.cwd(), 'src', 'mdx');
  const mdxRegExp = /\.mdx?$/;

  const paths = fs.readdirSync(mdxDir).filter((f) => mdxRegExp.test(f));

  const stellae = await Promise.all(
    paths.map(async (path) => {
      const filePath = p.join(mdxDir, path);
      const source = fs.readFileSync(filePath).toString();

      const { frontmatter } = await compileMDX<Metadata>({
        source,
        options: { parseFrontmatter: true },
      });

      return {
        slug: path.replace(mdxRegExp, ''),
        ...frontmatter,
      };
    }),
  );

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

  const types: (keyof typeof stellaeByType)[] = ['reference'];

  return (
    <div className={s['stellar-sea']}>
      <h1 className={s.heading1}>Stellar Sea</h1>

      {types.map((type) => (
        <div key={type} className={s.stellae}>
          {false && <h2 className={s.heading2}>{`${type}s`}</h2>}

          <ul className={s.links}>
            {stellaeByType[type].map(({ slug, ...m }) => (
              <li key={slug} className={s.link}>
                <Link href={`/stellar-sea/${slug}`}>{m.title}</Link>

                <div className={s.tag}>{m.updatedAt}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
export default Page;
