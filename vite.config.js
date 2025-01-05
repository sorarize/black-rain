import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: false
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  }
})
