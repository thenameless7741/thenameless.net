'use client';

import Image from 'next/image';

import { Gallery as Props } from '@/types/mdx';
import s from './gallery.module.scss';

const Gallery = ({ media }: Props) => {
  const baseUrl = process.env.NEXT_PUBLIC_CF_R2_BASE_URL;
  const resolvePath = (path: string) => `${baseUrl}/stellar-sea/${path}`;

  return (
    <div className={s.gallery}>
      {media.map((m) => {
        const src = resolvePath(m.path);
        const poster =
          m.type === 'video' && m.posterPath
            ? resolvePath(m.posterPath)
            : undefined;

        const base = { src, width: m.width, height: m.height };

        return (
          <figure key={src} className={s.figure}>
            {m.type === 'image' ? (
              <Image {...base} className={s.image} alt="" />
            ) : m.type === 'video' ? (
              <video
                {...base}
                className={s.video}
                style={
                  (poster
                    ? { background: `url('${poster}') no-repeat` }
                    : undefined) as React.CSSProperties
                }
                controls
                muted
                loop
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
                playsInline
                poster={poster}
                preload="none"
              />
            ) : null}

            {!!m.caption && (
              <figcaption className={s.caption}>{m.caption}</figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
};
export default Gallery;
