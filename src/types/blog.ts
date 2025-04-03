export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: Date;
  category?: string;
  tags?: string[];
  coverImage?: string;
  archived?: boolean;
}
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
