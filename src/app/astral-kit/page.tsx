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
      <h1 className={s.heading1}>Astral Kit</h1>

      <div className={s.stellae}>
        <h2 className={s.heading2}>Tutorials</h2>

        <ul className={s.links}>
          <li className={s.link}>
            <Link href="/astral-kit/anthropic-peit-00">Anthropic: Prompt Engineering Interactive Tutorial</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Page;
