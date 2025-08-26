import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/sprint-timer/',
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      allow: ['..']
    }
  },
  publicDir: 'public',
  build: {
    outDir: '../'
  }
})
