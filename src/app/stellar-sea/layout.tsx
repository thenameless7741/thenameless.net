import { Metadata } from 'next';

import s from './layout.module.scss';

export const metadata: Metadata = {
  title: 'Stellar Sea',
  description: 'A collection of notes from my interstellar journeys.',
};

const Layout = ({ children }: React.PropsWithChildren) => {
  return <div className={s.layout}>{children}</div>;
};
export default Layout;
