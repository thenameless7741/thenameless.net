import fs from 'fs';
import p from 'path';

import { MDXRemote } from 'next-mdx-remote/rsc';

import s from './stella.module.scss';

interface StellaProps {
  path: string;
}

const Stella = async ({ path }: StellaProps) => {
  const mdxDir = p.join(process.cwd(), 'src', 'mdx');
  const filePath = p.join(mdxDir, path);
  const source = fs.readFileSync(filePath).toString();

  return (
    <div className={s.stella}>
      <MDXRemote source={source} />
    </div>
  );
};
export default Stella;
