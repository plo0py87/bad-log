import { useState, useEffect, useMemo } from 'react';
import { BlogPost } from '../types/blog';
import BlogList from '../features/blog/components/BlogList';
import { getAllPosts, initializeFirebaseData } from '../services/blogService';
import AsciiBackground from '../components/ui/AsciiBackground';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 從 Firebase 加載文章
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // 初始化數據（如果需要）
        await initializeFirebaseData();

        // 獲取所有文章
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('加載文章時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Extract unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    posts.forEach(post => {
      if (post.category) {
        uniqueCategories.add(post.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [posts]);

  // Filter posts based on search, category, and archive status
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Filter by archive status - explicitly check for true
      if (post.archived === true) {
        return false;
      }

      // Filter by search query
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter by category
      const matchesCategory = selectedCategory === null || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, posts]);

  return (
    <div className="bg-black text-white py-12 relative min-h-screen">
      <AsciiBackground className="opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-wider text-white sm:text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
            文章列表
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent mx-auto mt-4 mb-6"></div>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-white opacity-80 font-light italic">
            "The pen is mightier than the sword."
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-white">載入文章中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800/50 p-4 text-center text-white rounded backdrop-blur">
            {error}
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-12 backdrop-blur-sm bg-white/5 p-6 border border-white/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="search" className="block text-sm font-light text-yellow-400/80 mb-1 tracking-wider">
                    搜尋
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="search"
                      className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 outline-none transition-all placeholder:text-white/20 font-light"
                      placeholder="搜尋文章..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-light text-yellow-400/80 mb-1 tracking-wider">
                    按類別篩選
                  </label>
                  <select
                    id="category"
                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-yellow-500/50 outline-none font-light"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                  >
                    <option value="" className="bg-black text-gray-400">所有類別</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-black text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results info */}
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-gray-400 font-light tracking-wide">
                顯示 {filteredPosts.length} 篇{filteredPosts.length === 1 ? '文章' : '文章'}
              </div>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="px-4 py-2 text-xs border border-white/10 hover:bg-white/5 text-white transition-colors tracking-widest"
                >
                  清除篩選
                </button>
              )}
            </div>

            {/* Blog Posts Grid */}
            {filteredPosts.length > 0 ? (
              <BlogList posts={filteredPosts} />
            ) : (
              <div className="text-center py-20 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg">
                <h2 className="text-xl font-light text-white tracking-wider">未找到文章</h2>
                <p className="text-gray-400 mt-2 font-light">請嘗試調整您的搜尋或篩選條件</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
