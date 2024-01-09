import localFont from 'next/font/local';

const bodyRegular = localFont({
  display: 'swap',
  src: '../../public/fonts/afacad-latin-400.woff2',
  variable: '--font-body-regular',
});
const bodyBold = localFont({
  display: 'swap',
  src: '../../public/fonts/afacad-latin-600.woff2',
  variable: '--font-body-bold',
  weight: '600',
});
const bodyItalic = localFont({
  display: 'swap',
  src: '../../public/fonts/afacad-latin-italic.woff2',
  variable: '--font-body-italic',
  weight: '600',
});

const font = {
  bodyRegular,
  bodyBold,
  bodyItalic,
};
export default font;
