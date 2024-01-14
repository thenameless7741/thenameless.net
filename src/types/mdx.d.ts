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
