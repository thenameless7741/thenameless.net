import { Metadata } from 'next';

import s from '@/app/stellar-sea/layout.module.scss';

export const metadata: Metadata = {
  title: 'Astral Kit',
  description: 'Toolkit for those embarking on interstellar journeys.',
};

const Layout = ({ children }: React.PropsWithChildren) => {
  return <div className={s.layout}>{children}</div>;
};
export default Layout;
