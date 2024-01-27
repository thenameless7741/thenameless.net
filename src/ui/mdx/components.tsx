import { MDXProvider } from '@mdx-js/react';
import Image from 'next/image';
import Prism from 'react-syntax-highlighter/dist/esm/prism';

import prism from '@/styles/prism';
import Link from '@/ui/link';
import Resource from './resource';
import s from './components.module.scss';

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
  strong: (props) => <strong {...props} className={s.strong} />,

  /**
   * custom components: block-level
   */
  Resource,

  /**
   * custom components: inline-level
   */
  Image: ({ alt, src, width, height }) => (
    <Image
      className={s.image}
      alt={alt ?? ''}
      src={src as string}
      width={width}
      height={height}
    />
  ),
};
export default components;
