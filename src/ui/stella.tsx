import fs from 'fs';
import p from 'path';

import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

import components from './mdx/components';
import Header from './mdx/header';
import s from './stella.module.scss';

interface StellaProps {
  path: string;
}

const Stella = async ({ path }: StellaProps) => {
  const mdxDir = p.join(process.cwd(), 'src', 'mdx');
  const filePath = p.join(mdxDir, path);
  const source = fs.readFileSync(filePath).toString();
  const { content, data } = matter(source);

  return (
    <div className={s.stella}>
      <Header data={data} />
      <MDXRemote components={components} source={content} />
    </div>
  );
};
export default Stella;
