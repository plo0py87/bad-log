import { Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import { useState, useEffect } from "react";
import { usePageViews } from "../hooks/usePageViews";
import FlipCounter from "../components/ui/FlipCounter";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this is the correct path to your Firebase config

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("site"); // 'site' or 'person'
  const { viewCount, loading, error } = usePageViews();
  const [totalArticles, setTotalArticles] = useState(0);

  useEffect(() => {
    async function fetchTotalArticles() {
      try {
        const querySnapshot = await getDocs(collection(db, "blog_posts"));
        setTotalArticles(querySnapshot.size);
      } catch (err) {
        console.error("Error fetching total articles:", err);
      }
    }
    fetchTotalArticles();
  }, []);

  return (
    <div className="kuchiki-overlay bg-black text-white">
      {/* Header */}
      <div className="relative bg-black">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1544133782-b62779394064?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="枯樹與森林"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-16 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent"></div>
            <h1 className="kuchiki-title text-4xl font-light tracking-wider text-white sm:text-5xl lg:text-6xl">
              關於本站
            </h1>
            <div className="mx-auto mb-6 mt-6 h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent"></div>
            <p className="mx-auto mt-6 max-w-3xl text-sm font-light text-white opacity-75">和我</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mx-auto max-w-7xl border-b border-gray-800 px-4 pb-4 pt-12 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-8">
          <button
            className={`px-4 py-2 text-lg font-light tracking-wider transition-colors ${activeTab === "site" ? "border-b-2 border-white text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("site")}
          >
            關於本站
          </button>
          <button
            className={`px-4 py-2 text-lg font-light tracking-wider transition-colors ${activeTab === "person" ? "border-b-2 border-white text-white" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("person")}
          >
            關於我
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* About Site Content */}
        {activeTab === "site" && (
          <>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2 className="kuchiki-title mb-6 text-3xl font-light tracking-wider text-white">
                  About
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="font-light text-white">
                    本站成立於2024年3月22日，初衷是希望有一個能讓自己隨意發聲的平台，
                    可以記錄生活與成長軌跡，不論是平時的胡思亂想，或是學到的新知識，都希望能在這個地方分享出去。
                  </p>
                  <p className="font-light text-white">
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
                    className="w-full border border-gray-800 contrast-125 grayscale"
                  />
                </div>
              </div>
            </div>

            {/* Additional content block with image on left */}
            <div className="mt-20 grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="relative order-2 flex items-center justify-center lg:order-1">
                <div className="w-11/12">
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                    alt="開發者工作"
                    className="w-full border border-gray-800 contrast-125 grayscale"
                  />
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="kuchiki-title mb-6 text-3xl font-light tracking-wider text-white">
                  Bad Log是什麼意思?
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="font-light text-white">
                    bad log，翻譯成中文就是朽木。起初是個隨便想的 Blog
                    諧音梗，後來覺得這個名字還蠻有意思的，就一直沿用下去。
                  </p>
                  <p className="font-light text-white">
                    子曰：「朽木不可雕也」，但我討厭孔子，我相信這世界上沒有所謂不可雕的朽木。
                    每個人剛出生時都是這個世界上的一塊朽木，一無所知，卻都有著自己的特點和價值，等待著被雕琢。
                  </p>
                  <p className="font-light text-white">
                    透過這個平台，記錄下我的嘗試和努力， 直到我打臉孔子，變成最強的木頭。
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="mt-20">
              <h2 className="kuchiki-title kuchiki-border mb-10 text-center text-3xl font-light tracking-wider text-white">
                Dashboard
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="kuchiki-card border border-gray-800 bg-gray-900 bg-opacity-60 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none border border-gray-800">
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-light tracking-wider text-white">瀏覽次數</h3>
                  {loading ? (
                    <span className="text-white opacity-60">載入中...</span>
                  ) : error ? (
                    <span className="text-red-400">{error}</span>
                  ) : (
                    <FlipCounter count={viewCount} />
                  )}
                  <p className="font-light text-white opacity-80"></p>
                </div>

                <div className="kuchiki-card border border-gray-800 bg-gray-900 bg-opacity-60 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none border border-gray-800">
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
                  <h3 className="mb-2 text-xl font-light tracking-wider text-white">網站上線天數</h3>
                  <div className="flex justify-center mb-3">
                    <div className="segment-display">
                    {Math.floor((new Date().getTime() - new Date('2024-04-08').getTime()) / (1000 * 60 * 60 * 24)).toString().padStart(5, '0').split('').map((digit, index) => (
                        <div key={index} className="segment-digit">
                          {digit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="kuchiki-card border border-gray-800 bg-gray-900 bg-opacity-60 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none border border-gray-800">
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
                        d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-light tracking-wider text-white">文章總數</h3>
                  <div className="flex justify-center mb-3">
                    <div className="segment-display">
                      {totalArticles.toString().padStart(5, '0').split('').map((digit, index) => (
                        <div key={index} className="segment-digit">
                          {digit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* About Person Content */}
        {activeTab === "person" && (
          <>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2 className="kuchiki-title mb-6 text-3xl font-light tracking-wider text-white">
                  Me
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="font-light text-white">
                    你好，我是陳興彥，這個網站的創建者和主要作者。
                  </p>
                  <p className="font-light text-white">
                    我目前就讀台大醫工系一年級，INFJ，喜歡寫程式、科技、音樂、打球、心理學。
                  </p>
                </div>

                <div className="mb-3 flex items-start">
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
                    <h3 className="text-lg font-light tracking-wider text-white">電子郵件</h3>
                    <p className="text-white opacity-70">ploopy0408@gmail.com</p>
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
                    <h3 className="text-lg font-light tracking-wider text-white">社群媒體</h3>
                    <div className="mt-2 flex space-x-4">
                      <a
                        href="https://www.instagram.com/plo0py87/"
                        className="text-white opacity-80 transition-colors duration-300 hover:text-white"
                      >
                        <span className="sr-only">Instagram</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="text-white opacity-80 transition-colors duration-300 hover:text-white"
                      >
                        <span className="sr-only">GitHub</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                      <a
                        href="#"
                        className="text-white opacity-80 transition-colors duration-300 hover:text-white"
                      >
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
                    src="public/profile.jpg"
                    alt="個人照片"
                    className="w-full border border-gray-800 contrast-125 grayscale"
                  />
                </div>
              </div>
            </div>

            {/* Skills section */}
            <div className="mt-20">
              <h2 className="kuchiki-title kuchiki-border mb-10 text-center text-3xl font-light tracking-wider text-white">
                技能與專長
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="kuchiki-card border border-gray-800 bg-gray-900 bg-opacity-60 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none border border-gray-800">
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
                  <h3 className="mb-2 text-xl font-light tracking-wider text-white">前端開發</h3>
                  <p className="font-light text-white opacity-80">
                    精通 HTML, CSS, JavaScript，以及現代框架如 React、Vue 和 Angular。
                    具有創建響應式、高性能網頁應用程序的豐富經驗。
                  </p>
                </div>

                <div className="kuchiki-card border border-gray-800 bg-gray-900 bg-opacity-60 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none border border-gray-800">
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
                  <h3 className="mb-2 text-xl font-light tracking-wider text-white">後端開發</h3>
                  <p className="font-light text-white opacity-80">
                    熟悉 Node.js, Express, MongoDB 等後端技術。 能夠設計和實現 RESTful
                    API，並確保高效的數據庫操作和穩定的服務器性能。
                  </p>
                </div>

                <div className="kuchiki-card border border-gray-800 bg-gray-900 bg-opacity-60 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-none border border-gray-800">
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
                  <h3 className="mb-2 text-xl font-light tracking-wider text-white">
                    用戶體驗設計
                  </h3>
                  <p className="font-light text-white opacity-80">
                    注重用戶體驗和界面設計。精通 Figma 和 Adobe XD，
                    能夠從概念到實現創建美觀且功能齊全的用戶界面。
                  </p>
                </div>
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="mt-20">
              <h2 className="kuchiki-title kuchiki-border mb-10 text-center text-3xl font-light tracking-wider text-white">
                經歷
              </h2>
              <div className="space-y-12">
                <div className="relative border-l border-gray-800 pl-8">
                  <div className="absolute left-[-6.5px] top-1.5 h-3 w-3 bg-white"></div>
                  <h3 className="text-xl font-light tracking-wider text-white">
                    高級前端開發工程師
                  </h3>
                  <p className="mb-3 mt-1 text-sm text-gray-400">2022年至今 · 某科技公司</p>
                  <p className="font-light text-white opacity-80">
                    負責公司主要產品的前端開發和維護，優化用戶界面和體驗。
                    引入現代前端技術，提高團隊開發效率。帶領前端團隊完成多個重要項目。
                  </p>
                </div>

                <div className="relative border-l border-gray-800 pl-8">
                  <div className="bg白 absolute left-[-6.5px] top-1.5 h-3 w-3"></div>
                  <h3 className="text白 text-xl font-light tracking-wider">網頁開發工程師</h3>
                  <p className="mb-3 mt-1 text-sm text-gray-400">2018年至2022年 · 另一家科技公司</p>
                  <p className="text白 font-light opacity-80">
                    參與多個企業網站和應用程序的開發。使用 React、Redux 和 TypeScript
                    構建高性能的網頁應用。 與後端團隊合作實現無縫的 API 集成。
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* CTA - Keep this in both tabs */}
        <div className="mt-20 border border-gray-800 bg-gray-900 bg-opacity-40 p-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-light tracking-wider text-white">準備好開始了嗎？</h2>
            <p className="mb-6 text-lg font-light text-white opacity-80">
              查看我們的最新文章或如有任何問題請與我們聯繫。
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/blog" className="kuchiki-btn">
                瀏覽文章
              </Link>
              <Link to="/contact" className="kuchiki-btn">
                聯絡我們
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
