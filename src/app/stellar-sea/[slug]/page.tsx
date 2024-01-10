import fs from 'fs';
import p from 'path';

import Stella from '@/ui/stella';

export const generateStaticParams = async () => {
  const mdxDir = p.join(process.cwd(), 'src', 'mdx');
  const mdxRegExp = /\.mdx?$/;

  const files = fs.readdirSync(mdxDir).filter((f) => mdxRegExp.test(f));
  return files.map((f) => f.replace(mdxRegExp, '')).map((slug) => ({ slug }));
};

interface Props {
  params: { slug: string };
}

const Page = async ({ params }: Props) => {
  const { slug } = params;
  return <Stella path={`${slug}.mdx`} />;
};
export default Page;
