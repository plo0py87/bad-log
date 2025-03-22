import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 設置基本公共路徑，項目名稱應該與您的GitHub倉庫名稱相同
  base: '/react-blog/',
})
