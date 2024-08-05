import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})

// https://fullstackopen.com/en/part3/deploying_app_to_internet
// Note that with the vite-configuration shown above, only requests that are made to paths starting with /api-are redirected to the server.
