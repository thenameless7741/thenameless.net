import fs from 'fs';
import p from 'path';

import Stella from '@/ui/stella';

export const generateStaticParams = async () => {
  const mdxDir = p.join(process.cwd(), 'src', 'mdx');
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

  const filePath = p.join(process.cwd(), 'src', 'mdx', `${slug}.mdx`);
  const source = fs.readFileSync(filePath).toString();

  const titleLine = source.split('\n')[1];
  const matches = titleLine?.match(/'([^']+)'/);

  return {
    title: matches ? matches[1] : 'stellar-sea',
  };
};

const Page = async ({ params }: Props) => {
  const { slug } = params;
  return <Stella path={`${slug}.mdx`} />;
};
export default Page;
