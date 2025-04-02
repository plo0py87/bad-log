import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black shadow-none border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-light text-white tracking-widest kuchiki-title">Bad Log</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-10">
            <Link to="/" className="px-3 py-2 text-sm font-light tracking-widest text-white hover:text-gray-300 transition-colors duration-300">
              首頁
            </Link>
            <Link to="/blog" className="px-3 py-2 text-sm font-light tracking-widest text-white hover:text-gray-300 transition-colors duration-300">
              文章
            </Link>
            <Link to="/gallery" className="px-3 py-2 text-sm font-light tracking-widest text-white hover:text-gray-300 transition-colors duration-300">
              作品
            </Link>
            <Link to="/about" className="px-3 py-2 text-sm font-light tracking-widest text-white hover:text-gray-300 transition-colors duration-300">
              關於
            </Link>

          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">開啟主選單</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="sm:hidden bg-black border-t border-gray-900">
          <div className="pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-light tracking-widest text-white hover:bg-gray-900 transition-colors duration-300">
              首頁
            </Link>
            <Link to="/blog" className="block px-3 py-2 text-base font-light tracking-widest text-white hover:bg-gray-900 transition-colors duration-300">
              文章
            </Link>
            <Link to="/gallery" className="block px-3 py-2 text-base font-light tracking-widest text-white hover:bg-gray-900 transition-colors duration-300">
              作品
            </Link>
            <Link to="/about" className="block px-3 py-2 text-base font-light tracking-widest text-white hover:bg-gray-900 transition-colors duration-300">
              關於
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
