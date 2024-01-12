import { MDXProvider } from '@mdx-js/react';
import Link from 'next/link';
import Prism from 'react-syntax-highlighter/dist/esm/prism';

import prism from '@/styles/prism';
import s from './index.module.scss';

const mdx: React.ComponentProps<typeof MDXProvider>['components'] = {
  /**
   * components: block-level
   */
  blockquote: (props) => <blockquote {...props} className={s.blockquote} />,
  h1: (props) => <h1 {...props} className={s.h1} />,
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
    const language = className.replace('language-', '');

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
  img: (props) => <img {...props} className={s.img} />,
  strong: (props) => <strong {...props} className={s.strong} />,

  /**
   * custom components: block-level
   */

  /**
   * custom components: inline-level
   */
};
export default mdx;
