import { defineConfig } from 'vite'
import glslify from 'vite-plugin-glslify'

export default defineConfig({
  plugins: [glslify.glslify()],
  server: {
    host: true,  // 自動檢測網路介面
    open: false
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    preserveSymlinks: true
  }
})
