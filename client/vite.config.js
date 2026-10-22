import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), tailwindcss()],

    // ทุก request ที่ขึ้นต้นด้วย /api จะถูกส่งต่อไปที่ VITE_API ให้อัตโนมัติ
    // เบราว์เซอร์มองว่าเป็น origin เดียวกัน เลยไม่ติด CORS และไม่ต้องแก้อะไรฝั่ง backend
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
