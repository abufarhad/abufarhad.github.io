import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Served from GitHub Pages at the domain root (abufarhad.github.io).
export default defineConfig(() => ({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // three.js is lazy-loaded after first paint, so its size never blocks rendering.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) return 'motion'
        },
      },
    },
  },
}))
