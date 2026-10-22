import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './routes'
import './mock' // <-- ลบบรรทัดนี้เมื่อต่อ backend จริง

createApp(App).use(router).mount('#app')
