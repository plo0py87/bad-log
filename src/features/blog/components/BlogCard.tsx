import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string | Date;
  author: {
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  category?: string;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  publishedDate,
  author,
  coverImage,
  category
}: BlogCardProps) {
  const formattedDate = typeof publishedDate === 'string'
    ? publishedDate
    : format(publishedDate, 'yyyy年MM月dd日', { locale: zhTW });

  return (
    <article className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-800 kuchiki-card">
      {coverImage && (
        <Link to={`/blog/${id}`} className="block h-48 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}

      <div className="p-6">
        {category && (
          <span className="text-xs font-light inline-block py-1 px-2 uppercase tracking-widest text-white bg-black bg-opacity-50 mb-2 border border-gray-800">
            {category}
          </span>
        )}

        <Link to={`/blog/${id}`}>
          <h2 className="text-xl font-light text-white mb-2 hover:text-gray-300 transition-colors tracking-wider">
            {title}
          </h2>
        </Link>

        <p className="text-white mb-4 line-clamp-3 opacity-80 font-light">
          {excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-8 h-8 rounded-none grayscale mr-2 border border-gray-800"
              />
            ) : (
              <div className="w-8 h-8 bg-black border border-gray-800 flex items-center justify-center mr-2">
                <span className="text-white font-light text-sm">
                  {author.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm text-white font-light">{author.name}</span>
          </div>

          <span className="text-sm text-white opacity-60 font-light">{formattedDate}</span>
        </div>
      </div>
    </article>
  );
}
