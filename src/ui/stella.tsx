import fs from 'fs';
import p from 'path';

import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

import markdown from './markdown';
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
      {Object.entries(data).map(([k, v], i) => (
        <div key={i}>{`${k}: ${v}`}</div>
      ))}
      <MDXRemote components={markdown} source={content} />
    </div>
  );
};
export default Stella;
