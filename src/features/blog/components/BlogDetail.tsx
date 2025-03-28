import { useEffect } from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { marked } from 'marked';
import { BlogPost } from '../../../types/blog';

interface BlogDetailProps {
  post: BlogPost;
}

export default function BlogDetail({ post }: BlogDetailProps) {
  const formattedDate = typeof post.publishedDate === 'string'
    ? post.publishedDate
    : format(post.publishedDate, 'yyyy年MM月dd日', { locale: zhTW });

  // Set up marked to render content as HTML
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
  }, []);

  const renderContent = () => {
    return { __html: marked(post.content) };
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Post header */}
      <div className="mb-10">
        {post.category && (
          <span className="text-xs font-light inline-block py-1 px-2 uppercase tracking-widest text-white bg-black bg-opacity-50 mb-4 border border-gray-800">
            {post.category}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-6 tracking-wide">
          {post.title}
        </h1>

        <div className="flex items-center space-x-4 mb-6">

          <span className="text-sm text-white opacity-60">{formattedDate}</span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-xs inline-block py-1 px-2 text-white bg-gray-900 border border-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Featured image */}
      {post.coverImage && (
        <div className="mb-10">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto max-h-96 object-cover border border-gray-800"
          />
        </div>
      )}

      {/* Post content */}
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={renderContent()}
      />
    </article>
  );
}
