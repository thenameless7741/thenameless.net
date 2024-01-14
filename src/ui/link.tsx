import { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  ArrowUpRight,
  GithubLogo,
  TwitterLogo,
  YoutubeLogo,
} from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

import s from './link.module.scss';

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const Component = ({ href, children, className, showIcon = true }: Props) => {
  const internal = /^(\.?\/|#)/.test(href);

  let Icon: PhosphorIcon | React.FunctionComponent | undefined;
  if (!internal && showIcon) {
    if (exps.arxiv.test(href)) {
      Icon = ArxivLogo;
    } else if (exps.github.test(href)) {
      Icon = GithubLogo;
    } else if (exps.twitter.test(href)) {
      Icon = TwitterLogo;
    } else if (exps.youtube.test(href)) {
      Icon = YoutubeLogo;
    } else {
      Icon = ArrowUpRight;
    }
  }
  // github, arxiv, twitter

  return (
    <Link
      className={[s.link, className ?? ''].join(' ')}
      href={href}
      rel={internal ? undefined : 'noopener noreferrer'}
      target={internal ? undefined : '_blank'}
    >
      {children}
      {!!Icon && <Icon weight="bold" />}
    </Link>
  );
};
export default Component;

const exps = {
  arxiv: /^https?:\/\/(www\.)?arxiv\.org/,
  github: /^https?:\/\/(www\.)?github\.com/,
  twitter: /^https?:\/\/(www\.)?(x\.com|twitter\.com|t\.co)/,
  youtube: /^https?:\/\/(www\.)?(youtu\.be|youtube\.com|t\.co)/,
};

const ArxivLogo = ({ fill = false }: { fill?: boolean }) => {
  const stroke = fill ? undefined : 'currentColor';
  const bg = 'white';
  const fills = fill ? ['#bdb9b4', '#b31b1b', '#bdb9b4'] : [bg, bg, bg];

  return (
    <svg
      viewBox="0 0 17.732 24.269"
      xmlns="http://www.w3.org/2000/svg"
      className={s.arxiv}
    >
      <g transform="translate(-566.984 -271.548)" stroke={stroke}>
        <path
          d="m573.549 280.916 2.266 2.738 6.674-7.84c.353-.47.52-.717.353-1.117a1.218 1.218 0 0 0 -1.061-.748.953.953 0 0 0 -.712.262z"
          fill={fills[0]}
        />
        <path
          d="m579.525 282.225-10.606-10.174a1.413 1.413 0 0 0 -.834-.5 1.09 1.09 0 0 0 -1.027.66c-.167.4-.047.681.319 1.206l8.44 10.242-6.282 7.716a1.336 1.336 0 0 0 -.323 1.3 1.114 1.114 0 0 0 1.04.69.992.992 0 0 0 .748-.365l8.519-7.92a1.924 1.924 0 0 0 .006-2.855z"
          fill={fills[1]}
        />
        <path
          d="m584.32 293.912-8.525-10.275-2.265-2.737-1.389 1.254a2.063 2.063 0 0 0 0 2.965l10.812 10.419a.925.925 0 0 0 .742.282 1.039 1.039 0 0 0 .953-.667 1.261 1.261 0 0 0 -.328-1.241z"
          fill={fills[2]}
        />
      </g>
    </svg>
  );
};
