import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import router from './routes'
const app = createApp(App)

axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('authtoken')

    if(config){
    config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})
app.use(router)
app.mount('#app')
