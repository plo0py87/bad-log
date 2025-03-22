import { BlogPost } from '../../../types/blog';
import BlogCard from './BlogCard';

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700">No posts found</h2>
        <p className="text-gray-500 mt-2">Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <BlogCard
          key={post.id}
          id={post.id}
          title={post.title}
          excerpt={post.excerpt}
          publishedDate={post.publishedDate}
          author={post.author}
          coverImage={post.coverImage}
          category={post.category}
        />
      ))}
    </div>
  );
}
