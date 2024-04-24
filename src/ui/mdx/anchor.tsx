import Link from '@/ui/link';
import s from './anchor.module.scss';

const Anchor = ({ children }: React.PropsWithChildren) => {
  return (
    <Link
      aria-label={`link to "${toText(children)}" heading`}
      className={s.anchor}
      href={toFragment(children)}
    >
      §
    </Link>
  );
};
export default Anchor;

export const toFragment = (node: React.ReactNode) => '#' + toAnchor(node);

export const toAnchor = (node: React.ReactNode) => {
  const text = toText(node);

  return encodeURIComponent(
    text.toLowerCase().replace(/[ ]/g, '-').replace(/[`]/g, ''),
  );
};

export const toText = (node: React.ReactNode) => {
  let text: string;

  if (typeof node === 'string') {
    text = node;
  } else if (node instanceof Array) {
    text = node
      .map((t) => {
        if (typeof t === 'string') return t;
        return t.props.children;
      })
      .join('');
  } else if (typeof node === 'object') {
    text = (node as unknown as JSX.Element).props.children;
  } else {
    throw new Error('toText: unsupported node type');
  }
  return text;
};
