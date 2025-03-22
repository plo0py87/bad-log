import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 使用相對路徑，確保資源正確加載
  build: {
    // 生成 ES 模塊輸出
    target: 'es2015',
    // 確保輸出正確的 MIME 類型
    rollupOptions: {
      output: {
        // 使用標準輸出格式
        format: 'es',
        // 明確的文件名模式，使用連字符而非點號
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // 生成 source maps
    sourcemap: true,
    // 確保輸出目錄為相對路徑
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
})
