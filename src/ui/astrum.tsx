import fs from 'fs';
import p from 'path';

import { MDXRemote } from 'next-mdx-remote/rsc';

import s from './astrum.module.scss';

interface AstrumProps {
  path: string;
}

const Astrum = async ({ path }: AstrumProps) => {
  const basePath = p.join(process.cwd(), 'src', 'astra');
  const fullPath = p.join(basePath, path);
  const source = fs.readFileSync(fullPath).toString();

  return (
    <div className={s.astrum}>
      <MDXRemote source={source} />
    </div>
  );
};
export default Astrum;
