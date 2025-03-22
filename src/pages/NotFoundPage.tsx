import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <div className="bg-black min-h-screen flex items-center justify-center text-white kuchiki-overlay">
      <div className="max-w-xl mx-auto px-4 text-center">
        <FaLeaf className="inline-block mb-4 text-4xl opacity-60 text-white" />
        <h1 className="text-7xl font-light tracking-wider text-white mb-4">404</h1>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-8"></div>
        <h2 className="text-3xl font-light mb-4 tracking-wider">頁面未找到</h2>
        <p className="text-xl text-white opacity-80 mb-8 font-light">
          抱歉，您請求的頁面不存在或已被移除。
        </p>
        <Link
          to="/"
          className="kuchiki-btn inline-block"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}
