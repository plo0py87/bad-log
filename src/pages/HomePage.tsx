import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import BlogList from '../features/blog/components/BlogList';
import { FaLeaf } from 'react-icons/fa';
import { getFeaturedPost, getPostById, getRecentPosts } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { subscribeToNewsletter } from '../services/newsletterService';
import FloatingDots from '../components/ui/FloatingDots';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);

  // 添加訂閱相關狀態
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Get featured post ID
        const featuredData = await getFeaturedPost();
        
        if (featuredData && featuredData.postId) {
          // Fetch the actual featured post
          const post = await getPostById(featuredData.postId);
          if (post) {
            setFeaturedPost(post);
          }
        }
        
        // Get recent posts (excluding the featured post)
        const posts = await getRecentPosts(3, featuredData?.postId);
        console.log('Recent posts:', posts);
        setRecentPosts(posts);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('載入資料時發生錯誤');
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // 處理訂閱表單提交
  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    
    // 簡單的郵箱格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubscribeMessage({ text: '請輸入有效的電子郵件地址', type: 'error' });
      return;
    }
    
    setIsSubscribing(true);
    setSubscribeMessage(null);
    
    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setSubscribeMessage({ text: result.message, type: 'success' });
        setEmail(''); // 清空表單
      } else {
        setSubscribeMessage({ text: result.message, type: 'error' });
      }
    } catch (error) {
      console.error('訂閱時發生錯誤:', error);
      setSubscribeMessage({ 
        text: '訂閱時發生錯誤，請稍後再試', 
        type: 'error' 
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="bg-black text-white kuchiki-overlay">
      {/* Hero section */}
      <div className="relative bg-black">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-40"
            src="https://i.pinimg.com/736x/da/34/97/da3497f9b65eb16722fc43662472a981.jpg"
            alt="森林中的古老樹木"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>
        
        {/* 獨立包裝的漂浮螢光點 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 20 }}>
          <FloatingDots 
            count={20} 
            minRadius={2} 
            maxRadius={6} 
            color="rgba(101, 255, 41, 0.9)" 
            minSpeed={0.3}
            maxSpeed={1.2}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
            <h1 className="text-4xl font-light tracking-wider text-white sm:text-5xl lg:text-6xl kuchiki-title mb-6">
              Bad Log
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-white font-light">
            Bad Log，簡寫就是blog，歡迎來到我的blog
              <br />
              <span className="text-sm opacity-75"></span>
            </p>
          </div>
        </div>
      </div>

      {/* Featured post section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light tracking-widest text-white sm:text-3xl kuchiki-title kuchiki-border">
            精選文章
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white opacity-80 font-light">
            Featured Article
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-white">載入中...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-8">
            {error}
          </div>
        ) : featuredPost ? (
          <div className="mt-12 flex flex-col lg:flex-row rounded-sm shadow-xl overflow-hidden kuchiki-card">
            {featuredPost.coverImage && (
              <div className="lg:w-1/2">
                <img
                  className="h-64 w-full object-cover lg:h-full filter contrast-125"
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                />
              </div>
            )}

            <div className="lg:w-1/2 bg-gray-900 bg-opacity-60 p-8">
              {featuredPost.category && (
                <span className="text-xs font-light inline-block py-1 px-2 uppercase tracking-widest text-white bg-black bg-opacity-50 mb-4 border border-gray-800">
                  {featuredPost.category}
                </span>
              )}

              <Link to={`/blog/${featuredPost.id}`}>
                <h3 className="text-2xl font-light text-white hover:text-gray-200 transition-colors tracking-wide">
                  {featuredPost.title}
                </h3>
              </Link>

              <p className="mt-3 text-white opacity-80">
                {featuredPost.excerpt}
              </p>

              <div className="mt-6 flex items-center">
                <div>
                  <p className="text-sm text-white opacity-60">
                    {typeof featuredPost.publishedDate === 'string'
                      ? featuredPost.publishedDate
                      : featuredPost.publishedDate.toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  to={`/blog/${featuredPost.id}`}
                  className="kuchiki-btn"
                >
                  繼續閱讀
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white opacity-70">目前沒有精選文章</p>
          </div>
        )}
      </div>

      {/* Recent posts */}
      <div className="kuchiki-container py-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-light tracking-widest text-white sm:text-3xl kuchiki-title kuchiki-border">
              最近的文章
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-white opacity-80 font-light">
              Recent Articles
            </p>
          </div>

          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="text-white">載入中...</div>
              </div>
            ) : recentPosts.length > 0 ? (
              <BlogList posts={recentPosts} />
            ) : (
              <div className="text-center py-8">
                <p className="text-white opacity-70">沒有最近的文章</p>
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/blog"
              className="kuchiki-btn"
            >
              查看所有文章
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="bg-black py-16 sm:py-24 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-none px-6 py-10 bg-gray-900 bg-opacity-40 overflow-hidden shadow-xl sm:px-12 sm:py-20 border border-gray-800">
            <div className="relative">
              <div className="text-center">
                <h2 className="text-2xl font-light text-white tracking-widest kuchiki-title">
                  訂閱通訊
                </h2>
                <p className="mt-4 text-lg text-white opacity-70 font-light">
                  當我們發佈新文章和更新時獲得通知
                </p>
              </div>
              <form 
                className="mt-8 sm:flex sm:items-center sm:justify-center"
                onSubmit={handleSubscribe}
              >
                <div className="min-w-0 w-full sm:max-w-xs">
                  <label htmlFor="email" className="sr-only">
                    電子郵件地址
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="kuchiki-input w-full"
                    placeholder="輸入您的電子郵件"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribing}
                    required
                  />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    type="submit"
                    className="kuchiki-btn"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? '處理中...' : '訂閱'}
                  </button>
                </div>
              </form>
              
              {/* 訂閱回饋訊息 */}
              {subscribeMessage && (
                <div className={`mt-4 text-center p-2 ${
                  subscribeMessage.type === 'success' 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {subscribeMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
