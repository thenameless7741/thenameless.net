import Link from '@/ui/link';
import s from '@/app/stellar-sea/page.module.scss';

const Page = async () => {
  const links: { path: string; title: string }[] = [
    {
      path: 'anthropic-peit-00',
      title: 'Anthropic: Prompt Engineering Interactive Tutorial',
    },
    // { path: 'anthropic-tut-00', title: 'Anthropic: Tool Use Tutorial' },
  ];

  return (
    <div className={s['stellar-sea']}>
      <h1 className={s.heading1}>Astral Kit</h1>

      <div className={s.stellae}>
        <h2 className={s.heading2}>Tutorials</h2>

        <ul className={s.links}>
          {links.map(({ path, title }) => (
            <li key={path} className={s.link}>
              <Link href={`/astral-kit/${path}`}>{title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Page;
