import * as React from 'react';
import { FiMaximize2, FiX, FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import AsciiBackground from "../components/ui/AsciiBackground";

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
    const [galleryItems, setGalleryItems] = React.useState<GalleryItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = React.useState('全部');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [activeImage, setActiveImage] = React.useState<GalleryItem | null>(null);

    // Fetch gallery items from Firebase
    React.useEffect(() => {
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
        <div className="bg-black text-white relative min-h-screen">
            <AsciiBackground className="opacity-50" />

            {/* Header */}
            <div className="relative pt-16 z-10">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-light tracking-wider text-white sm:text-5xl lg:text-6xl drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">作品</h1>
                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent mx-auto mt-6 mb-6"></div>
                        <p className="mt-6 max-w-3xl mx-auto text-lg text-white font-light opacity-75 italic">
                            "The code is mightier than the pen."
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="mb-12 backdrop-blur-sm bg-white/5 p-6 border border-white/10 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Search */}
                        <div className="col-span-1 md:col-span-2">
                            <label htmlFor="search" className="block text-sm font-light text-yellow-400/80 mb-1 tracking-wider">
                                搜尋
                            </label>
                            <input
                                type="text"
                                id="search"
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 outline-none transition-all placeholder:text-white/20 font-light"
                                placeholder="搜尋作品..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-light text-yellow-400/80 mb-1 tracking-wider">
                                按類別篩選
                            </label>
                            <select
                                id="category"
                                className="w-full bg-black/50 border border-white/10 rounded p-2 text-white focus:border-yellow-500/50 outline-none font-light"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category} className="bg-black text-white">
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
                {loading ? (
                    <div className="text-center py-20 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-white/60 font-light">載入中...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 backdrop-blur-sm bg-white/5 border border-red-900/40 rounded-lg">
                        <p className="text-red-400 font-light">{error}</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="text-center py-20 backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-white/60 font-light">找不到相符的作品</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-black/40 border border-white/5 hover:border-yellow-500/30 overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.1)] rounded-lg"
                                onClick={() => setActiveImage(item)}
                            >
                                <div className="relative aspect-w-4 aspect-h-3 overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="border border-white/20 p-3 rounded-full hover:bg-white/10 transition-colors">
                                            <FiMaximize2 className="text-white text-xl" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-light text-white tracking-wider group-hover:text-yellow-400 transition-colors">{item.title}</h3>
                                    <p className="text-sm text-gray-400 mt-2 whitespace-pre-line line-clamp-2 font-light leading-relaxed">{item.description}</p>
                                    <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-4">
                                        <span className="text-xs text-gray-500 font-mono">{item.date}</span>
                                        <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 text-gray-300 rounded font-light">{item.category}</span>
                                    </div>
                                    {item.url && (
                                        <div className="mt-4 text-right">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center text-xs text-yellow-500/80 hover:text-yellow-400 transition-colors"
                                                onClick={(e) => e.stopPropagation()} // Prevent lightbox from opening
                                            >
                                                <span>開啟連結</span>
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
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="relative w-full h-full flex flex-col justify-center px-4 sm:px-12">
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-white/50 hover:text-white p-2 hover:bg-white/10 rounded-full transition-all z-10"
                            onClick={() => setActiveImage(null)}
                        >
                            <FiX className="w-8 h-8" />
                        </button>

                        {/* Navigation buttons */}
                        <button
                            className="absolute left-4 sm:left-10 text-white/50 hover:text-emerald-400 p-3 hover:bg-white/5 rounded-full transition-all"
                            onClick={() => navigateModal('prev')}
                        >
                            <FiChevronLeft className="w-8 h-8" />
                        </button>
                        <button
                            className="absolute right-4 sm:right-10 text-white/50 hover:text-emerald-400 p-3 hover:bg-white/5 rounded-full transition-all"
                            onClick={() => navigateModal('next')}
                        >
                            <FiChevronRight className="w-8 h-8" />
                        </button>

                        {/* Image */}
                        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
                            <div className="relative border border-white/10 bg-black/40 rounded-lg overflow-hidden p-1">
                                <img
                                    src={activeImage.imageUrl}
                                    alt={activeImage.title}
                                    className="w-full max-h-[70vh] object-contain rounded"
                                />
                            </div>
                            <div className="mt-6 text-center max-w-2xl">
                                <h3 className="text-2xl font-light text-white tracking-widest">{activeImage.title}</h3>
                                <p className="text-gray-400 mt-2 font-light whitespace-pre-line">{activeImage.description}</p>
                                <div className="flex justify-center items-center mt-4 gap-4">
                                    <span className="text-sm text-white/40 font-mono">{activeImage.date}</span>
                                    <span className="text-sm bg-white/5 px-3 py-1 text-emerald-300/80 rounded border border-white/5">{activeImage.category}</span>
                                </div>
                                {activeImage.url && (
                                    <div className="mt-6">
                                        <a
                                            href={activeImage.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center px-6 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors uppercase tracking-widest text-sm rounded bg-emerald-950/20"
                                        >
                                            <span>View Project</span>
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
