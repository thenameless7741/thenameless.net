import fs from 'fs';
import p from 'path';

import Image from 'next/image';
import { compileMDX } from 'next-mdx-remote/rsc';

import { Metadata } from '@/types/mdx';
import components from '@/ui/mdx/components';
import TOC from '@/ui/mdx/toc';
import { getHeadings } from '@/utils/mdx';
import Playground from '../playground';
import Header from './header';
import Settings from './settings';
import cs from '@/ui/mdx/components.module.scss';
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
    components: {
      ...components,

      // override
      Image: ({ alt, path, width, height }) => (
        <Image
          className={cs.image}
          alt={alt ?? ''}
          src={`${process.env.NEXT_PUBLIC_CF_R2_BASE_URL}/astral-kit/${path}`}
          width={width}
          height={height}
        />
      ),

      Playground,
      Settings: (props) => <Settings {...props} standalone={false} />,
    },
    options: { parseFrontmatter: true },
  });

  const headings = await getHeadings(filePath);

  return (
    <div className={s.stella}>
      <Header data={frontmatter} />
      <TOC headings={headings} />
      {content}
    </div>
  );
};
export default Stella;
