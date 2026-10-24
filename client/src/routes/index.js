import { createRouter, createWebHistory } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import Overview from '../pages/Overview.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'overview', component: Overview },
        { path: '/login', name: 'login', component: () => import('../pages/LoginView.vue') },
        { path: '/register', name: 'register', component: () => import('../pages/RegisterView.vue') },

        // ผู้รับการประเมิน
        { path: '/user', name: 'user', component: () => import('../pages/UserView.vue'), meta: { role: 'user' } },

        // กรรมการผู้ประเมิน
        { path: '/boss', name: 'boss', component: () => import('../pages/BossView.vue'), meta: { role: 'boss' } },

        // เจ้าหน้าที่
        { path: '/officer', name: 'officer', component: () => import('../pages/officer/TopicView.vue'), meta: { role: 'officer' } },
        { path: '/officer/match', name: 'match', component: () => import('../pages/officer/MatchView.vue'), meta: { role: 'officer' } },
        { path: '/officer/matchquiz', name: 'matchquiz', component: () => import('../pages/officer/MatchQuiz.vue'), meta: { role: 'officer' } },
        { path: '/officer/role', name: 'role', component: () => import('../pages/officer/RoleView.vue'), meta: { role: 'officer' } },
        { path: '/officer/time', name: 'time', component: () => import('../pages/officer/TimeView.vue'), meta: { role: 'officer' } },
        { path: '/officer/report', name: 'report', component: () => import('../pages/officer/ReportView.vue'), meta: { role: 'officer' } },
         { path: '/officer/creatuser', name: 'creatuser', component: () => import('../pages/officer/creatuser.vue'), meta: { role: 'officer' } },
         { path: '/officer/chagpass/:id', name: 'chagpass', component: () => import('../pages/officer/chagpass.vue'), meta: { role: 'officer' } },
    ],
})

const getrole = () => {
    const token = localStorage.getItem('authtoken')
    if (!token) return null
    try {
        return jwtDecode(token).role
    } catch {
        localStorage.removeItem('authtoken')
        return null
    }
}

// กันเข้าหน้าผิด role
router.beforeEach((to) => {
    if (to.meta.role && to.meta.role !== getrole()) return '/login'
})

export default router
