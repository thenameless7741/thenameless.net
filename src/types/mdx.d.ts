export interface Metadata {
  title: string;
  subtitle?: string;
  type: 'log' | 'pattern' | 'reference' | 'tutorial';
  stage: 'aether' | 'nebula' | 'star';
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

type BaseMedia = { path: string; width: number; height: number };

export type Media =
  | (BaseMedia & {
      type: 'image';
      caption?: string;
    })
  | (BaseMedia & {
      type: 'video';
      caption?: string;
      posterPath?: string;
    });

export interface Gallery {
  media: Media[];
}

export interface Link {
  text: string;
  url: string;
}

export interface Resource {
  content: Link;
  extras?: Link[];
  summary?: string;
  description?: string;
  author?: Link & {
    url?: string;
  };
  tags?: string[];
}
