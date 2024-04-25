import { MDXProvider } from '@mdx-js/react';
import Image from 'next/image';
import Prism from 'react-syntax-highlighter/dist/esm/prism';

import prism from '@/styles/prism';
import Link from '@/ui/link';
import Anchor, { toAnchor } from './anchor';
import Audience from './audience';
import Gallery from './gallery';
import Pagination from './pagination';
import Playground from './playground';
import Resource from './resource';
import s from './components.module.scss';

const components: React.ComponentProps<typeof MDXProvider>['components'] = {
  /**
   * components: block-level
   */
  blockquote: (props) => <blockquote {...props} className={s.blockquote} />,
  h2: ({ children, ...props }) => (
    <h2 id={toAnchor(children)} {...props} className={s.h2}>
      {children}
      <Anchor>{children}</Anchor>
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 id={toAnchor(children)} {...props} className={s.h3}>
      {children}
      <Anchor>{children}</Anchor>
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 id={toAnchor(children)} {...props} className={s.h4}>
      {children}
      <Anchor>{children}</Anchor>
    </h4>
  ),
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
  Audience,
  Details: (props) => <details {...props} className={s.details} />,
  Gallery,
  Pagination,
  Playground,
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
  Mark: (props) => <mark {...props} className={s.mark} />,
};
export default components;
