import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 使用相對路徑而不是絕對路徑，解決資源加載問題
  base: './',
  build: {
    // 生成 ES 模塊輸出
    target: 'es2015',
    // 確保輸出正確的 MIME 類型
    rollupOptions: {
      output: {
        // 使用傳統的腳本方式
        format: 'es',
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    // 生成 source maps
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
})
