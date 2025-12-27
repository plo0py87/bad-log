import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  publishedDate: string | Date;
  coverImage?: string;
  category?: string;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  publishedDate,
  coverImage,
  category
}: BlogCardProps) {
  const formattedDate = typeof publishedDate === 'string'
    ? publishedDate
    : format(publishedDate, 'yyyy年MM月dd日', { locale: zhTW });

  return (
    <article className="group bg-black border border-white/5 hover:border-yellow-500/30 overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] rounded-lg">
      {coverImage && (
        <Link to={`/blog/${id}`} className="block h-48 overflow-hidden relative">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
        </Link>
      )}

      <div className="p-6">
        {category && (
          <span className="text-xs font-light inline-block py-1 px-2 uppercase tracking-widest text-yellow-500/90 bg-white/5 mb-2 border border-white/10 rounded">
            {category}
          </span>
        )}

        <Link to={`/blog/${id}`}>
          <h2 className="text-xl font-light text-white mb-2 group-hover:text-yellow-400 transition-colors tracking-wider">
            {title}
          </h2>
        </Link>

        <p className="text-white mb-4 line-clamp-3 opacity-80 font-light">
          {excerpt}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-white opacity-60 font-light">{formattedDate}</span>
        </div>
      </div>
    </article>
  );
}
