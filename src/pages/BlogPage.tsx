import { useState, useEffect, useMemo } from 'react';
import { BlogPost } from '../types/blog';
import BlogList from '../features/blog/components/BlogList';
import { getAllPosts, initializeFirebaseData } from '../services/blogService';
import { FaSearch } from 'react-icons/fa';

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

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
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
    <div className="bg-black text-white py-12 kuchiki-overlay">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-wider text-white sm:text-4xl kuchiki-title">
            文章列表
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-4 mb-6"></div>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-white opacity-80 font-light">
            瀏覽我們關於Web開發、設計和技術的文章集合
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-white">載入文章中...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-800 p-4 text-center text-white">
            {error}
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="mb-12 bg-gray-900 bg-opacity-40 p-6 border border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="search" className="block text-sm font-light text-white mb-1 tracking-wider">
                    搜尋
                  </label>
                  <input
                    type="text"
                    id="search"
                    className="kuchiki-input w-full"
                    placeholder="搜尋文章..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Category Filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-light text-white mb-1 tracking-wider">
                    按類別篩選
                  </label>
                  <select
                    id="category"
                    className="kuchiki-input w-full"
                    value={selectedCategory || ''}
                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                  >
                    <option value="">所有類別</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Results info */}
            <div className="mb-6 flex justify-between items-center">
              <div className="text-sm text-white opacity-80 font-light">
                顯示 {filteredPosts.length} 篇{filteredPosts.length === 1 ? '文章' : '文章'}
              </div>
              {(searchQuery || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                  className="kuchiki-btn text-sm"
                >
                  清除篩選
                </button>
              )}
            </div>

            {/* Blog Posts Grid */}
            {filteredPosts.length > 0 ? (
              <BlogList posts={filteredPosts} />
            ) : (
              <div className="text-center py-12 bg-gray-900 bg-opacity-40 border border-gray-800">
                <h2 className="text-xl font-light text-white tracking-wider">未找到文章</h2>
                <p className="text-white mt-2 opacity-80 font-light">請嘗試調整您的搜尋或篩選條件</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
