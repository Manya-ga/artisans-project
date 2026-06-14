import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ensure SPA entry is served at `/` (some environments open the dev root URL).
function serveIndexAtRoot() {
  return {
    name: 'serve-index-at-root',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url === '') req.url = '/index.html'
        next()
      })
    },
  }
}

export default defineConfig({
  appType: 'spa',
  plugins: [react(), serveIndexAtRoot()],
  server: {
    port: 5173,
    strictPort: false,
  }
})