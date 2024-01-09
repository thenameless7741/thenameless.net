import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '[the]nameless',
  description: 'A playspace for experimenting with intelligence amplification.',
};

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};
export default Layout;
