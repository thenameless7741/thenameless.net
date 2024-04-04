import fs from 'fs';
import p from 'path';

import { compileMDX } from 'next-mdx-remote/rsc';

import { Metadata } from '@/types/mdx';
import Link from '@/ui/link';
import s from '@/app/stellar-sea/page.module.scss';

const Page = async () => {
  const mdxDir = p.join(process.cwd(), 'src', 'app', 'astral-kit', 'mdx');
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

  return (
    <div className={s['stellar-sea']}>
      <h1 className={s.title}>Astral Kit</h1>

      <div className={s.stellae}>
        <ul className={s.links}>
          {stellae.map(({ slug, ...m }) => (
            <li key={slug} className={s.link}>
              <Link href={`/astral-kit/${slug}`}>{m.title}</Link>

              <div className={s['updated-at']}>{m.updatedAt}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Page;
