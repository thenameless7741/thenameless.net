import fs from 'fs';
import p from 'path';

import Stella from './stella';

const mdxDir = p.join(process.cwd(), 'src', 'app', 'astral-kit', 'mdx');

export const generateStaticParams = async () => {
  const mdxRegExp = /\.mdx?$/;

  const paths = fs.readdirSync(mdxDir).filter((path) => mdxRegExp.test(path));
  return paths
    .map((path) => path.replace(mdxRegExp, ''))
    .map((slug) => ({ slug }));
};

interface Props {
  params: { slug: string };
}

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = params;

  const filePath = p.join(mdxDir, `${slug}.mdx`);
  const source = fs.readFileSync(filePath).toString();

  const titleLine = source.split('\n')[1];
  const matches = titleLine?.match(/'([^']+)'/);

  return {
    title: matches ? matches[1] : 'astral-kit',
  };
};

const Page = async ({ params }: Props) => {
  const { slug } = params;
  return <Stella path={`${slug}.mdx`} />;
};
export default Page;
