import Image from 'next/image';

import Link from '@/ui/link';
import s from './index.module.scss';

const AstralExpress = async () => {
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
          <Link className={s.link} href="/stellar-sea">
            Stellar Sea
          </Link>

          <Link className={s.link} href="/cosmos-arena">
            Cosmos Arena
          </Link>
        </div>
      </footer>
    </div>
  );
};
export default AstralExpress;
