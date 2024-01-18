import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';

import s from '@/ui/stella.module.scss';
import components from './components';

interface Props {
  path: string;
}

const Stellula = ({ path }: Props) => {
  const [source, setSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const loadMDX = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const res = await fetch(`${baseUrl}/mdx/${path}.mdx`);
      const text = await res.text();

      const mdxSource = await serialize(text, {
        mdxOptions: {
          // next-mdx-remote issue#350 workaround
          development: process.env.NODE_ENV === 'development',
        },
      });
      setSource(mdxSource);
    };
    loadMDX();
  }, [path]);

  return (
    <div className={s.stella}>
      {!!source && <MDXRemote {...source} components={components} />}
    </div>
  );
};
export default Stellula;
