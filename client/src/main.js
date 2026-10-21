import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('authtoken')

    if(config){
    config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})
axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('authtoken')
    
    if(config){
    config.headers.Authorization = `Bearer ${token}`

    return config;
    }
})
axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('authtoken')
    if(config){
        config.headers.Authorization = `Bearer ${token}`

        return config;
    }
})
axios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('authtoken')
    if(config){
        config.headers.Authorization = `Bearer ${token}`

        return config;
    }
})
createApp(App).mount('#app')
