import fs from 'fs';
import p from 'path';

import { MDXProvider } from '@mdx-js/react';
import matter from 'gray-matter';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Prism from 'react-syntax-highlighter/dist/esm/prism';

import prism from '@/styles/prism';
import Link from '@/ui/link';
import Header from './mdx/header';
import Resource from './mdx/resource';
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

const components: React.ComponentProps<typeof MDXProvider>['components'] = {
  /**
   * components: block-level
   */
  blockquote: (props) => <blockquote {...props} className={s.blockquote} />,
  h2: (props) => <h2 {...props} className={s.h2} />,
  h3: (props) => <h3 {...props} className={s.h3} />,
  h4: (props) => <h4 {...props} className={s.h4} />,
  hr: (props) => <hr {...props} className={s.hr} />,
  li: (props) => <li {...props} className={s.li} />,
  ol: (props) => <ol {...props} className={s.ol} />,
  p: (props) => <p {...props} className={s.p} />,
  pre: (props) => {
    const code = props.children as React.ReactElement;
    const { children, className } = code.props;
    const language = className?.replace('language-', '');

    return (
      <Prism className={s.pre} style={prism} language={language}>
        {children}
      </Prism>
    );
  },
  ul: (props) => <ul {...props} className={s.ul} />,

  /**
   * components: inline-level
   */
  a: ({ children, href }) =>
    href && (
      <Link className={s.a} href={href}>
        {children}
      </Link>
    ),
  code: (props) => <code {...props} className={s.code} />,
  em: (props) => <em {...props} className={s.em} />,
  img: ({ alt, src }) => (
    <Image className={s.img} alt={alt ?? ''} src={src as string} />
  ),
  strong: (props) => <strong {...props} className={s.strong} />,

  /**
   * custom components: block-level
   */
  Resource,

  /**
   * custom components: inline-level
   */
};
