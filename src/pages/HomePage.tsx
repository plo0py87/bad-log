import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import BlogList from '../features/blog/components/BlogList';
import { FaLeaf } from 'react-icons/fa';

export default function HomePage() {
  // Get the newest post as featured
  const featuredPost = blogPosts[0];
  // Get the rest of the posts for the recent posts section
  const recentPosts = blogPosts.slice(1, 4);

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
              <span className="text-sm opacity-75">分享生活、想法、興趣</span>
            </p>
          </div>
        </div>
      </div>

      {/* Featured post */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light tracking-widest text-white sm:text-3xl kuchiki-title kuchiki-border">
            精選文章
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-white opacity-80 font-light">
            Featured Article
          </p>
        </div>

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
              {featuredPost.author.avatar ? (
                <img
                  className="h-10 w-10 rounded-none grayscale mr-3 border border-gray-800"
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                />
              ) : (
                <div className="h-10 w-10 bg-black border border-gray-800 flex items-center justify-center mr-3">
                  <span className="text-white font-light">
                    {featuredPost.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-light text-white">{featuredPost.author.name}</p>
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
            <BlogList posts={recentPosts} />
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

      {/* Quote section */}
      <div className="bg-black py-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-auto mb-8"></div>
            <p className="text-xl font-light italic text-white opacity-80 max-w-2xl mx-auto tracking-wide">
              "朽木也能重新綻放花朵，舊事物中孕育著新知識。"
            </p>
            <p className="mt-2 text-sm font-light text-white opacity-60">
              腐朽的木頭重新開花。新知識從舊事物中湧現。
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-800 to-transparent mx-auto mt-8"></div>
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
              <form className="mt-8 sm:flex sm:items-center sm:justify-center">
                <div className="min-w-0 w-full sm:max-w-xs">
                  <label htmlFor="email" className="sr-only">
                    電子郵件地址
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="kuchiki-input w-full"
                    placeholder="輸入您的電子郵件"
                  />
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    type="submit"
                    className="kuchiki-btn"
                  >
                    訂閱
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
