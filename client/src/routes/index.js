import { createRouter, createWebHistory } from 'vue-router'
import OverView from "../pages/OverView.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {path:'/', name:'overview', component: OverView },
    {path: '/login',   name: 'login', component: () => import('../pages/LoginView.vue'), },
    {path: '/register',   name: 'register', component: () => import('../pages/RegisterView.vue'), },
    {path: '/user',   name: 'user', component: () => import('../pages/UserView.vue'), },
    {path: '/officer',   name: 'officer', component: () => import('../pages/OfficerView.vue'), },
    {path: '/boss',   name: 'boss', component: () => import('../pages/BossView.vue'), },
    ]
})

export default router;