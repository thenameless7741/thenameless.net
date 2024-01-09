import { Metadata } from 'next';

import AutoRefresh from '@/utils/auto-refresh';

import '@/styles/global.scss';

export const metadata: Metadata = {
  title: '[the]nameless',
  description: 'A playspace for experimenting with intelligence amplification.',
};

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <AutoRefresh>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AutoRefresh>
  );
};
export default Layout;
