export interface Metadata {
  title: string;
  subtitle?: string;
  type: 'log' | 'pattern' | 'reference';
  stage: 'aether' | 'nebula' | 'star';
  topics: string[];
  createdAt: string;
  updatedAt: string;
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
