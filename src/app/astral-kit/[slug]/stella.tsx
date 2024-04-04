import fs from 'fs';
import p from 'path';

import { compileMDX } from 'next-mdx-remote/rsc';

import { Metadata } from '@/types/mdx';
import components from '@/ui/mdx/components';
import Header from './header';
import s from '@/ui/stella.module.scss';

interface StellaProps {
  path: string;
}

const Stella = async ({ path }: StellaProps) => {
  const mdxDir = p.join(process.cwd(), 'src', 'app', 'astral-kit', 'mdx');
  const filePath = p.join(mdxDir, path);
  const source = fs.readFileSync(filePath).toString();

  const { content, frontmatter } = await compileMDX<Metadata>({
    source,
    components,
    options: { parseFrontmatter: true },
  });

  return (
    <div className={s.stella}>
      <Header data={frontmatter} />
      {content}
    </div>
  );
};
export default Stella;
