import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="bg-black text-white kuchiki-overlay">
      {/* Header */}
      <div className="bg-black relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1544133782-b62779394064?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="枯樹與森林"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaLeaf className="inline-block mb-4 text-3xl opacity-60 text-white" />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
            <h1 className="text-4xl font-light tracking-wider text-white sm:text-5xl lg:text-6xl kuchiki-title">關於我們</h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 mb-6"></div>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-white font-light">
              了解更多關於我們的博客和團隊
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-light text-white mb-6 tracking-wider kuchiki-title">我們的故事</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-white font-light">
                歡迎來到我們的博客！我們是一個由充滿熱情的開發者、設計師和技術愛好者組成的團隊，
                致力於分享有關網頁開發、設計和技術的知識與見解。
              </p>
              <p className="text-white font-light">
                我們的博客成立於2024年，擁有一個簡單的使命：創建高質量、易於理解的內容，
                幫助各個水平的開發者提升技能並了解最新趨勢。
              </p>
              <p className="text-white font-light">
                無論您是剛開始網頁開發之旅，還是經驗豐富的專業人士，
                我們的文章都旨在提供有價值的見解、實用的技巧和深入的教程。
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="團隊合作"
              className="border border-gray-800 grayscale contrast-125"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="text-3xl font-light text-white mb-10 text-center tracking-wider kuchiki-title kuchiki-border">我們的價值觀</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 bg-opacity-60 p-6 border border-gray-800 kuchiki-card">
              <div className="w-12 h-12 border border-gray-800 rounded-none flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-light text-white mb-2 tracking-wider">優質內容</h3>
              <p className="text-white opacity-80 font-light">
                我們致力於創建全面、經過深入研究的內容，為讀者提供真正的價值。
                每篇文章都經過仔細的審核過程，以確保準確性和清晰度。
              </p>
            </div>

            <div className="bg-gray-900 bg-opacity-60 p-6 border border-gray-800 kuchiki-card">
              <div className="w-12 h-12 border border-gray-800 rounded-none flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-light text-white mb-2 tracking-wider">社群導向</h3>
              <p className="text-white opacity-80 font-light">
                我們相信社群的力量。我們的博客是開發者學習、分享和共同成長的空間。
                我們鼓勵讀者在所有文章上提供反饋和討論。
              </p>
            </div>

            <div className="bg-gray-900 bg-opacity-60 p-6 border border-gray-800 kuchiki-card">
              <div className="w-12 h-12 border border-gray-800 rounded-none flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-light text-white mb-2 tracking-wider">易於理解</h3>
              <p className="text-white opacity-80 font-light">
                我們致力於讓內容對所有人都易於理解。
                這意味著創建無論您的經驗水平如何，都能輕鬆理解的文章。
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 bg-opacity-40 border border-gray-800 p-8 mt-20">
          <div className="text-center">
            <h2 className="text-2xl font-light text-white mb-4 tracking-wider">準備好開始了嗎？</h2>
            <p className="text-lg text-white opacity-80 mb-6 font-light">
              查看我們的最新文章或如有任何問題請與我們聯繫。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/blog"
                className="kuchiki-btn"
              >
                瀏覽文章
              </Link>
              <Link
                to="/contact"
                className="kuchiki-btn"
              >
                聯絡我們
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
