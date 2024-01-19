import localFont from 'next/font/local';

const title = localFont({
  display: 'swap',
  src: '../../public/fonts/quicksand-latin-400.woff2',
  variable: '--font-title',
});

const body = localFont({
  display: 'swap',
  src: '../../public/fonts/afacad-latin-400.woff2',
  variable: '--font-body',
});
const bodyBold = localFont({
  display: 'swap',
  src: '../../public/fonts/afacad-latin-600.woff2',
  variable: '--font-body-bold',
  weight: '500',
});
const bodyItalic = localFont({
  display: 'swap',
  src: '../../public/fonts/afacad-latin-italic.woff2',
  variable: '--font-body-italic',
});

const label = localFont({
  display: 'swap',
  src: '../../public/fonts/montserrat-latin-600.woff2',
  variable: '--font-label',
});

const code = localFont({
  display: 'swap',
  src: '../../public/fonts/sometype-mono-latin-400.woff2',
  variable: '--font-code',
});

const font = {
  title,
  body,
  bodyBold,
  bodyItalic,
  label,
  code,
};
export default font;
