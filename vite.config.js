import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: 'index.html',
        dashboard: 'dashboard.html',
        preference: 'preference.html',
        wallet: 'wallet.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  optimizeDeps: {
    include: ['bootstrap', 'aos', 'swiper']
  }
})