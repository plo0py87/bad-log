export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedDate: string | Date;
  author: Author;
  coverImage?: string;
  category?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
