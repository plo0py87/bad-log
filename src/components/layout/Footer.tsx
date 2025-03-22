import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-xl font-light mb-2 text-white tracking-widest kuchiki-title">朽木</h2>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-4"></div>
              <p className="text-white font-light text-sm tracking-wider">
                將技術與知識作為自然的一部分分享
              </p>
              <p className="text-white opacity-60 text-xs mt-1">
                分享技術與知識，如同自然的一部分
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-lg font-light mb-2 text-white tracking-widest">導覽</h2>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-4"></div>
              <ul className="space-y-2 text-center md:text-left">
                <li>
                  <Link to="/" className="text-white hover:text-gray-300 text-sm font-light tracking-wider transition-colors duration-300">
                    首頁
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="text-white hover:text-gray-300 text-sm font-light tracking-wider transition-colors duration-300">
                    文章
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-white hover:text-gray-300 text-sm font-light tracking-wider transition-colors duration-300">
                    關於
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white hover:text-gray-300 text-sm font-light tracking-wider transition-colors duration-300">
                    聯絡我們
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-center md:items-start">
              <h2 className="text-lg font-light mb-2 text-white tracking-widest">連接</h2>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-4"></div>
              <div className="flex space-x-6 justify-center md:justify-start">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 text-center border-t border-gray-900">
          <div className="flex flex-col items-center">
            <p className="text-white opacity-60 text-xs font-light tracking-wider">
              &copy; {currentYear} 朽木. 版權所有.
            </p>
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-gray-800 to-transparent mt-4 mb-4"></div>
            <p className="text-white opacity-40 text-xs font-light italic">
              "古老朽木中孕育新知識"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
