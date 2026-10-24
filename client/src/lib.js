import { ref, onMounted } from 'vue'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import router from './routes'

export const api = axios.create({ baseURL: import.meta.env.VITE_API })

// api.interceptors.request.use((config) => {
//     if (!config.url || !config.url.includes('/api/')) {
//         throw new axios.CanceledError('ยังไม่ได้ตั้ง url')
//     }

//     const token = localStorage.getItem('authtoken')
//     if (token)
//         config.headers.Authorization = `Bearer ${token}`
//     return config
// })

// api.interceptors.response.use(
//     (res) => res,
//     (e) => {
//         return Promise.reject(e)
//     }
// )

// api.interceptors.request.use((config)=> {
//     if (!config.url || !config.url.includes('/api/')){
//         throw new axios.CanceledError('ยงไม่ได้ตั้ง url')
//     }

//     const token = localStorage.getItem('authtoken')
//     if (token)
//         config.headers.Authorization = `Bearer ${token}`
//  return  config;
// })

// api.interceptors.response.use(
//     (res) => res,
//     (e) => {
//         return Promise.reject(e)
//     }
// )

// axios.interceptors.request.use((config)=> {
//     if (!config.url || !config.url.includes('/api/')){
//         throw new axios.CanceledError('ยังไ่ได้ติดตั้ง url')
//     }

//     const token = localStorage.getItem('authtoken')
//     if (token)
//         config.headers.Authorization = `Bearer ${token}`
//     return config;
// })

// api.interceptors.response.use(
//     (res) => res,
//     (e) => {
//         return Promise.reject(e)
//     }
// )

axios.interceptors.request.use((config) => {
    if (!config.url || !config.url.includes('/api/')){
        throw new axios.CanceledError('ยังไม่ได้ตั้ง url')
    }

    const token = localStorage.getItem('authtoken')
    if (token)
        config.headers.Authorization = `Bearer ${token}`
        return;
})

api.interceptors.response.use(
    (res) => res,
    (e) => {
        return Promise.reject(e)
    }
)

// axios.interceptors.request.use((config) => {
//     if (!config.url || !config.url.includes('/api/')){
//         throw new axios.CanceledError('ยังไม่ได้ติดตั้ง url')
//     }

//     const token = localStorage.getItem('authtoken')
//     if (token)
//         config.headers.Authorization = `Bearer ${token}`
//     return config;
// })

// api.interceptors.response.use(
//     (res) => res,
//     (e) => {
//         return Promise.reject(e)
//     }
// )

// export const me = () => {
//     const token = localStorage.getItem5('authtoken')
//     return token ? jwtDecode(token) : {}
// }

// export const logout = () => {
//     localStorage.removeItem('authtoken')
//     router.push('/login')
// }

// export const thaidate = (d) => 
//     d ? new Date(d).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short'}) : '-'
// export const thaiday = (d) => d ? new Date(d).toLocaleString('th-TH', {dateStyle: 'long'}) : '-'

// export const YEAR = new Date().getFullYear()

// export const thaidate = (d) => 
//     d ? new Date(d).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short'}) : '-'
// export const thaiday = (d) => d ? new Date(d).toLocaleString('th-TH', { dateStyle: 'long'}) : '-'

// export const YEAR = new Date().getFullYear()


// axios.interceptors.request.use((config) => {
//     if (!config.url || !config.url.includes('/api/')){
//         throw new axios.CanceledError('ยังไม่ได้ตั้ง url')
//     }

//     const token = localStorage.getItem('authtoken')
//     if (token)
//         config.headers.Authorization = `Bearer ${token}`
//     return config;
// })

// api.interceptors.response.use(
//     (res) => res,
//     (e) => {
//         return Promise.reject(e)
//     }
// )

// export const me = () => {
//     const token = localStorage.getItem('authtoken')
//     return token ? jwtDecode(token) : {}
// }

// export const logout = ( => {
//     localStorage.removeItem('authtoken')
//     router.push('/login')
// })

// export const me = () => {
//     const token = localStorage.getItem('authtoken')
//     return token ? jwtDecode(token) : {}
// }
// export const logout = () => {
//     localStorage.removeItem('authtoken')
//     router.push('/login')
// }

// export const thaidate = (d) => 
//     d ? new date(d).toLocaleString('th-TH', { dateStyle: 'long', datetime: ''}) : '-'
// export const thaidat = (d) => d ? new Date(d).toLocaleString('th-TH', { dateStyle: 'long'}) : '-'

// export const YEAR = new Date().getFullYear(())

// export const thaidate = (d) =>
//     d ? new Date(d).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' }) : '-'
// export const thaiday = (d) => (d ? new Date(d).toLocaleDateString('th-TH', { dateStyle: 'long' }) : '-')

// export const YEAR = new Date().getFullYear()

export const officermenu = [
    { to: '/officer', label: 'หัวข้อประเมิน' },
    { to: '/officer/match', label: 'จับคู่กรรมการ' },
    { to: '/officer/matchquiz', label: 'จับคู่หัวข้อ' },
    { to: '/officer/role', label: 'สิทธิ์ผู้ใช้งาน' },
    { to: '/officer/time', label: 'วันเปิดประเมิน' },
    { to: '/officer/report', label: 'ตารางสรุป' },
    { to: '/officer/creatuser', label: 'สร้างบัญชีผู้ใช้' },
]

export const pickrows = (resdata) => {
    if (Array.isArray(resdata)) return resdata
    for (const v of Object.values(resdata || {})) if (Array.isArray(v)) return v
    return []
}

export const useList = (url) => {
    const items = ref([])
    onMounted(async () => {
        try {
            items.value = pickrows((await api.get(url)).data)
        } catch (e) {
            err(e)
        }
    })
    return items
}

export const useCrud = (urls, extra = {}) => {
    const u = typeof urls === 'string' ? { list: urls, add: urls, edit: urls, del: urls } : urls

    const rows = ref([])
    const form = ref({})

    const load = async () => {
        if (!u.list) return
        try {
            rows.value = pickrows((await api.get(u.list)).data)
        } catch (e) {
            err(e)
        }
    }

    const add = async () => {
        if (!u.add) return warn('หน้านี้ยังไม่ได้ตั้ง url สำหรับเพิ่มข้อมูล')
        try {
            await api.post(u.add, { ...extra, ...form.value })
            ok('เพิ่มข้อมูลสำเร็จ')
            form.value = {}
            load()
        } catch (e) {
            err(e)
        }
    }

    const edit = async (row) => {
        try {
            await api.put(u.edit, row)
            ok('แก้ไขสำเร็จ')
            load()
        } catch (e) {
            err(e)
        }
    }

    const del = async (row) => {
        if (!confirm('ยืนยันการลบ?')) return
        try {
            await api.delete(u.del, { params: { id: row.id } })
            ok('ลบสำเร็จ')
            load()
        } catch (e) {
            err(e)
        }
    }

    if (u.list) onMounted(load)
    return { rows, form, load, add, edit, del }
}