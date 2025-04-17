import { useState, useEffect } from 'react';
import { FiMaximize2, FiX, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Gallery item type definition
interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  url?: string; // Add URL field
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);
  
  // Fetch gallery items from Firebase
  useEffect(() => {
    async function fetchGalleryItems() {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "gallery_items"));
        const items: GalleryItem[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          items.push({
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            category: data.category || '',
            date: data.date || '',
            url: data.url || '', // Include URL in data
          });
        });
        
        setGalleryItems(items);
        setError(null);
      } catch (err) {
        console.error("Error fetching gallery items:", err);
        setError("載入圖片時發生錯誤");
      } finally {
        setLoading(false);
      }
    }
    
    fetchGalleryItems();
  }, []);

  // Get unique categories from fetched items
  const categories = ['全部', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  // Filter gallery items based on category and search query
  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle modal navigation
  const navigateModal = (direction: 'prev' | 'next') => {
    if (!activeImage) return;
    
    const currentIndex = filteredItems.findIndex(item => item.id === activeImage.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
    }
    
    setActiveImage(filteredItems[newIndex]);
  };

  return (
    <div className="bg-black text-white kuchiki-overlay">
      {/* Header */}
      <div className="bg-black relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://i.pinimg.com/736x/66/cc/7e/66cc7e666f8ff176841f70162607048e.jpg"
            alt="森林中的光線"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
            <h1 className="text-4xl font-light tracking-wider text-white sm:text-5xl lg:text-6xl kuchiki-title">作品</h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 mb-6"></div>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-white font-light opacity-75">
            "The computer is mightier than the pen."
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                placeholder="搜尋作品..."
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
                className="kuchiki-input w-full text-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-900 text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {loading ? (
          <div className="text-center py-20 border border-gray-800 bg-gray-900 bg-opacity-40">
            <p className="text-white font-light">載入中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-gray-800 bg-gray-900 bg-opacity-40">
            <p className="text-red-400 font-light">{error}</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 border border-gray-800 bg-gray-900 bg-opacity-40">
            <p className="text-white font-light">找不到相符的作品</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group bg-gray-900 bg-opacity-40 border border-gray-800 overflow-hidden cursor-pointer"
                onClick={() => setActiveImage(item)}
              >
                <div className="relative aspect-w-4 aspect-h-3">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <FiMaximize2 className="text-white text-2xl" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-light text-white tracking-wider">{item.title}</h3>
                  <p className="text-sm text-white opacity-70 mt-1 whitespace-pre-line">{item.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-white opacity-60">{item.date}</span>
                    <span className="text-xs bg-gray-800 px-2 py-1 text-white opacity-80">{item.category}</span>
                  </div>
                  {item.url && (
                    <div className="mt-3 text-right">
                      <a 
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-3 py-1 text-xs border border-gray-600 text-white hover:bg-gray-800 transition-colors"
                        onClick={(e) => e.stopPropagation()} // Prevent lightbox from opening
                      >
                        <span>查看「{item.title}」</span>
                        <FiExternalLink className="ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col justify-center px-4 sm:px-12">
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 text-white p-2 hover:bg-gray-800 z-10"
              onClick={() => setActiveImage(null)}
            >
              <FiX className="w-6 h-6" />
            </button>
            
            {/* Navigation buttons */}
            <button 
              className="absolute left-4 sm:left-10 text-white p-2 hover:bg-gray-800 rounded-full"
              onClick={() => navigateModal('prev')}
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button 
              className="absolute right-4 sm:right-10 text-white p-2 hover:bg-gray-800 rounded-full"
              onClick={() => navigateModal('next')}
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
            
            {/* Image */}
            <div className="w-full max-w-5xl mx-auto">
              <img 
                src={activeImage.imageUrl} 
                alt={activeImage.title} 
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="mt-4">
                <h3 className="text-xl font-light text-white tracking-wider">{activeImage.title}</h3>
                <p className="text-white opacity-80 mt-2 whitespace-pre-line">{activeImage.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-white opacity-60">{activeImage.date}</span>
                  <span className="text-sm bg-gray-800 px-3 py-1 text-white opacity-80">{activeImage.category}</span>
                </div>
                {activeImage.url && (
                  <div className="mt-4">
                    <a 
                      href={activeImage.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-600 text-white hover:bg-gray-800 transition-colors"
                    >
                      <span>查看「{activeImage.title}」</span>
                      <FiExternalLink className="ml-2" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
