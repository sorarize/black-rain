import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,  // 自動檢測網路介面
    open: false
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    preserveSymlinks: true
  }
})
