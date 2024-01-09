import { Metadata } from 'next';

import font from '@/styles/font';
import AutoRefresh from '@/utils/auto-refresh';

import '@/styles/global.scss';

export const metadata: Metadata = {
  title: '[the]nameless',
  description: 'A playspace for experimenting with intelligence amplification.',
};

const fontVars = Object.values(font)
  .map((f) => f.variable)
  .join(' ');

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <AutoRefresh>
      <html lang="en">
        <body className={fontVars}>{children}</body>
      </html>
    </AutoRefresh>
  );
};
export default Layout;
