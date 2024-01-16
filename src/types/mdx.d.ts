export interface Metadata {
  title: string;
  subtitle?: string;
  type: 'pattern' | 'reference';
  stage: 'atom' | 'nebula' | 'star';
  topics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  content: {
    text: string;
    url: string;
  };
  description?: string;
  author?: {
    text: string;
    url?: string;
  };
  tags?: string[];
}
