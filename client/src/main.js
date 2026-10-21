import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import router from './routes'
const app = createApp(App)

axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('authtoken')

    if(token){
    config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})
axios.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401){
            localStorage.removeItem('authtoken'),
            router.push('/login')
        }
        return Promise.reject(err)
    }
)
app.use(router)
app.mount('#app')
