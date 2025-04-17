import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllPosts, getPostById } from '../services/blogService';
import BlogDetail from '../features/blog/components/BlogDetail';
import BlogCard from '../features/blog/components/BlogCard';
import { BlogPost } from '../types/blog';
import CommentSection from '../features/blog/components/CommentSection';

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [nextInSeries, setNextInSeries] = useState<BlogPost | null>(null); // Add this state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 載入文章和相關文章
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // 獲取當前文章
        const currentPost = await getPostById(id);

        if (!currentPost) {
          navigate('/404');
          return;
        }

        setPost(currentPost);

        // 獲取所有文章以尋找相關文章
        const allPosts = await getAllPosts();

        // 找出相關文章（相同類別或至少一個共同標籤）
        const related = allPosts
          .filter(p => {
            if (p.id === currentPost.id) return false;

            // 按類別關聯
            if (p.category === currentPost.category) return true;

            // 按標籤關聯（如果兩篇文章都有標籤）
            if (p.tags && currentPost.tags) {
              return p.tags.some(tag => currentPost.tags?.includes(tag));
            }

            return false;
          })
          .slice(0, 3);

        setRelatedPosts(related);

        // 尋找同一系列中的下一篇文章（相同類別，但發布日期較新的第一篇）
        if (currentPost.category) {
          // Filter all posts in the same category except the current one
          const sameCategoryPosts = allPosts.filter(p => 
            p.id !== currentPost.id && 
            p.category === currentPost.category
          );
          
          // Sort by publish date to find the next one chronologically
          const sortedPosts = sameCategoryPosts.sort((a, b) => 
            new Date(a.publishedDate).getTime() - new Date(b.publishedDate).getTime()
          );
          
          // Find the first post with a date later than current post
          const nextPost = sortedPosts.find(p => 
            new Date(p.publishedDate) > new Date(currentPost.publishedDate)
          );
          
          setNextInSeries(nextPost || null);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('載入文章時發生錯誤');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="bg-black text-white py-12 text-center">
        <p>載入文章中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white py-12 text-center">
        <p className="text-red-400">{error}</p>
        <Link to="/blog" className="kuchiki-btn mt-4 inline-block">
          返回文章列表
        </Link>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="bg-black text-white pb-16 kuchiki-overlay">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex text-sm text-gray-400">
          <li>
            <Link to="/" className="hover:text-white transition-colors duration-300">
              首頁
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li>
            <Link to="/blog" className="hover:text-white transition-colors duration-300">
              文章
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className="text-white font-medium truncate">
            {post.title}
          </li>
        </ol>
      </nav>

      {/* Blog post */}
      <BlogDetail post={post} />

      {/* Comment Section - Add this before Next in Series */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <CommentSection postId={post.id} />
      </div>

      {/* Next in Series */}
      {nextInSeries && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="border-t border-gray-800 pt-8">
            <h3 className="text-xl font-light text-white mb-4 tracking-wider">
              繼續觀看此系列下一篇文章
            </h3>
            <div className="bg-gray-900 border border-gray-800 p-6 hover:border-gray-600 transition-colors duration-300">
              <Link to={`/blog/${nextInSeries.id}`} className="flex flex-col md:flex-row gap-4 items-center">
                {nextInSeries.coverImage && (
                  <div className="w-full md:w-1/3 lg:w-1/4">
                    <img 
                      src={nextInSeries.coverImage} 
                      alt={nextInSeries.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <div className={nextInSeries.coverImage ? "w-full md:w-2/3 lg:w-3/4" : "w-full"}>
                  <span className="text-sm text-gray-400">下一篇</span>
                  <h4 className="text-xl font-medium text-white mt-1">{nextInSeries.title}</h4>
                  <p className="text-gray-300 mt-2 line-clamp-2">{nextInSeries.excerpt}</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-2xl font-light text-white mb-8 tracking-wider">相關文章</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map(relatedPost => (
              <BlogCard
                key={relatedPost.id}
                id={relatedPost.id}
                title={relatedPost.title}
                excerpt={relatedPost.excerpt}
                publishedDate={relatedPost.publishedDate}
                coverImage={relatedPost.coverImage}
                category={relatedPost.category}
              />
            ))}
          </div>
        </div>
      )}

      {/* Next/Prev Navigation */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="border-t border-gray-800 py-8 flex justify-between">
          {/* Previous Post - 這裡的邏輯可以改進，因為 ID 不一定是連續數字 */}
          {parseInt(post.id) > 1 && (
            <Link
              to={`/blog/${parseInt(post.id) - 1}`}
              className="text-white hover:text-gray-300 flex items-center transition-colors duration-300"
            >
              <svg
                className="mr-2 w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>上一篇文章</span>
            </Link>
          )}

          {/* Just a spacer when there's no previous post */}
          {parseInt(post.id) === 1 && <div />}

          {/* Next Post */}
          <Link
            to="/blog"
            className="text-white hover:text-gray-300 flex items-center transition-colors duration-300"
          >
            <span>返回文章列表</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
