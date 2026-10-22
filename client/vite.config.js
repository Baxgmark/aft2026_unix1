import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), tailwindcss()],

    server: {
      proxy: {
        '/api': {
          target: env.VITE_API || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
  }
})
