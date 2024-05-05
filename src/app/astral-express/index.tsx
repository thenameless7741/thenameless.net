import Image from 'next/image';

import Link from '@/ui/link';
import s from './index.module.scss';

const AstralExpress = async () => {
  const links = [
    { href: '/astral-kit', children: 'Astral Kit' },
    { href: '/cosmos-arena', children: 'Cosmos Arena' },
    { href: '/stellar-sea', children: 'Stellar Sea' },
  ];

  return (
    <div className={s['astral-express']}>
      <Image
        className={s.logo}
        alt="thenameless"
        src="/images/logo.svg"
        width={568}
        height={91}
      />

      <footer className={s.footer}>
        <div className={s.links}>
          {links.map((l) => (
            <Link key={l.href} className={s.link} {...l} />
          ))}
        </div>
      </footer>
    </div>
  );
};
export default AstralExpress;
