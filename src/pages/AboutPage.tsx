import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';
import { useState } from 'react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('site'); // 'site' or 'person'

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
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"></div>
            <h1 className="text-4xl font-light tracking-wider text-white sm:text-5xl lg:text-6xl kuchiki-title">關於本站</h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mt-6 mb-6"></div>
            <p className="mt-6 max-w-3xl mx-auto text-sm text-white font-light opacity-75">
              和我
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4 border-b border-gray-800">
        <div className="flex justify-center space-x-8">
          <button 
            className={`px-4 py-2 text-lg font-light tracking-wider transition-colors ${activeTab === 'site' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('site')}
          >
            關於本站
          </button>
          <button 
            className={`px-4 py-2 text-lg font-light tracking-wider transition-colors ${activeTab === 'person' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('person')}
          >
            關於我
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Site Content */}
        {activeTab === 'site' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-light text-white mb-6 tracking-wider kuchiki-title">About</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-white font-light">
                    本站成立於2024年3月22日，初衷是希望有一個能讓自己隨意發聲的平台，
                    可以記錄生活與成長軌跡，也可以分享平時的胡思亂想，也是一個展現自己學習成果的地方。（可能會分享一點技術內容）（但我很菜）
                  </p>
                  <p className="text-white font-light">
                    無論我們在現實生活中認不認識，
                    都歡迎您來看我碎碎念，一切交流與指教都非常歡迎！希望來到這裡的人都能找到自己想要的東西。
                  </p>
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="w-11/12">
                  <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="團隊合作"
                    className="border border-gray-800 grayscale contrast-125 w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Additional content block with image on left */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-20">
              <div className="relative order-2 lg:order-1 flex items-center justify-center">
                <div className="w-11/12">
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="開發者工作"
                    className="border border-gray-800 grayscale contrast-125 w-full"
                  />
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl font-light text-white mb-6 tracking-wider kuchiki-title">Bad Log是什麼意思?</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-white font-light">
                  bad log，翻譯成中文就是朽木。起初是個隨便想的 Blog 諧音梗，後來覺得這個名字還蠻有意思的，就一直沿用下去。
                  </p>
                  <p className="text-white font-light">
                    子曰：「朽木不可雕也」，但我討厭孔子，我相信這世界上沒有所謂不可雕的朽木。
                    每個人剛出生時都是這個世界上的一塊朽木，一無所知，卻都有著自己的特點和價值，等待著被雕琢。
                  </p>
                  <p className="text-white font-light">
                    透過這個平台，記錄自己雕琢自己的過程，記錄下我的嘗試和努力，
                    直到我打臉孔子，變成最強的木頭。
                  </p>
                </div>
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
          </>
        )}

        {/* About Person Content */}
        {activeTab === 'person' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-light text-white mb-6 tracking-wider kuchiki-title">Me</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-white font-light">
                    你好，我是 Plo0py，一位熱愛寫程式和分享知識的開發者。我對技術充滿熱情，
                    特別是在前端開發和用戶體驗設計方面。當我不在寫程式的時候，你可能會發現我在閱讀、
                    寫作或是探索大自然。
                  </p>
                  <p className="text-white font-light">
                    我相信知識應該被自由分享，這也是我創建這個平台的原因之一。
                    通過這個部落格，我希望能夠記錄自己的學習歷程，並且幫助其他人避開我曾經遇到過的陷阱。
                  </p>
                </div>
              
              <div className="flex items-start mb-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-light text-white tracking-wider">電子郵件</h3>
                  <p className="text-white opacity-70">contact@reactblog.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-light text-white tracking-wider">社群媒體</h3>
                  <div className="flex space-x-4 mt-2">
                    <a href="#" className="text-white opacity-80 hover:text-white transition-colors duration-300">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-white opacity-80 hover:text-white transition-colors duration-300">
                      <span className="sr-only">GitHub</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-white opacity-80 hover:text-white transition-colors duration-300">
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              </div>

              <div className="relative flex items-center justify-center">
                <div className="w-4/5">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="個人照片"
                    className="border border-gray-800 grayscale contrast-125 w-full"
                  />
                </div>
              </div>
            </div>
            
            {/* Skills section */}
            <div className="mt-20">
              <h2 className="text-3xl font-light text-white mb-10 text-center tracking-wider kuchiki-title kuchiki-border">技能與專長</h2>
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
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-white mb-2 tracking-wider">前端開發</h3>
                  <p className="text-white opacity-80 font-light">
                    精通 HTML, CSS, JavaScript，以及現代框架如 React、Vue 和 Angular。
                    具有創建響應式、高性能網頁應用程序的豐富經驗。
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
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-white mb-2 tracking-wider">後端開發</h3>
                  <p className="text-white opacity-80 font-light">
                    熟悉 Node.js, Express, MongoDB 等後端技術。
                    能夠設計和實現 RESTful API，並確保高效的數據庫操作和穩定的服務器性能。
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
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-light text-white mb-2 tracking-wider">用戶體驗設計</h3>
                  <p className="text-white opacity-80 font-light">
                    注重用戶體驗和界面設計。精通 Figma 和 Adobe XD，
                    能夠從概念到實現創建美觀且功能齊全的用戶界面。
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="mt-20">
              <h2 className="text-3xl font-light text-white mb-10 text-center tracking-wider kuchiki-title kuchiki-border">經歷</h2>
              <div className="space-y-12">
                <div className="relative pl-8 border-l border-gray-800">
                  <div className="absolute w-3 h-3 bg-white left-[-6.5px] top-1.5"></div>
                  <h3 className="text-xl font-light text-white tracking-wider">高級前端開發工程師</h3>
                  <p className="text-sm text-gray-400 mt-1 mb-3">2022年至今 · 某科技公司</p>
                  <p className="text-white opacity-80 font-light">
                    負責公司主要產品的前端開發和維護，優化用戶界面和體驗。
                    引入現代前端技術，提高團隊開發效率。帶領前端團隊完成多個重要項目。
                  </p>
                </div>

                <div className="relative pl-8 border-l border-gray-800">
                  <div className="absolute w-3 h-3 bg白 left-[-6.5px] top-1.5"></div>
                  <h3 className="text-xl font-light text白 tracking-wider">網頁開發工程師</h3>
                  <p className="text-sm text-gray-400 mt-1 mb-3">2018年至2022年 · 另一家科技公司</p>
                  <p className="text白 opacity-80 font-light">
                    參與多個企業網站和應用程序的開發。使用 React、Redux 和 TypeScript 構建高性能的網頁應用。
                    與後端團隊合作實現無縫的 API 集成。
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CTA - Keep this in both tabs */}
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
