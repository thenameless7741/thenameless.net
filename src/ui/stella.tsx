import fs from 'fs';
import p from 'path';

import { compileMDX } from 'next-mdx-remote/rsc';

import { Metadata } from '@/types/mdx';
import { getHeadings } from '@/utils/mdx';
import components from './mdx/components';
import Header from './mdx/header';
import TOC from '@/ui/mdx/toc';
import s from './stella.module.scss';

interface StellaProps {
  path: string;
}

const Stella = async ({ path }: StellaProps) => {
  const mdxDir = p.join(process.cwd(), 'src', 'mdx');
  const filePath = p.join(mdxDir, path);
  const source = fs.readFileSync(filePath).toString();

  const { content, frontmatter } = await compileMDX<Metadata>({
    source,
    components,
    options: { parseFrontmatter: true },
  });

  const headings = await getHeadings(filePath);

  return (
    <div className={s.stella}>
      <Header data={frontmatter} />
      <TOC headings={headings} depth={1} />
      {content}
    </div>
  );
};
export default Stella;
