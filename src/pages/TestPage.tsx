import * as React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">測試頁面</h1>
        <p className="text-lg">這是一個測試頁面，用來確認基本渲染是否正常。</p>
        <div className="mt-4 p-4 bg-emerald-900/30 rounded-lg">
          <p>如果你看到這個內容，說明 React、Tailwind CSS 都運作正常。</p>
        </div>
      </div>
    </div>
  );
}