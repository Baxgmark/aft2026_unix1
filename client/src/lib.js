import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { jwtDecode } from 'jwt-decode'
import router from './routes'

export const api = axios.create({ timeout: 10000 })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authtoken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    (e) => {
        if (e.response?.status === 401) logout()
        return Promise.reject(e)
    }
)

// ---- ตัวช่วย Swal สั้นๆ ----
export const ok = (title) => Swal.fire({ icon: 'success', title, timer: 1500, showConfirmButton: false })
export const warn = (title) => Swal.fire({ icon: 'warning', title })
// ถ้า backend ไม่ได้ส่ง message มา ให้โชว์ method + url + status จะได้รู้ว่าพังตรงไหน
export const err = (e) =>
    Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: e.response?.data?.message ||
            `${e.config?.method?.toUpperCase() || ''} ${e.config?.url || ''} → ${e.response?.status || e.message}`,
    })
export const ask = async (title) =>
    (await Swal.fire({ icon: 'question', title, showCancelButton: true, confirmButtonText: 'ตกลง', cancelButtonText: 'ยกเลิก' })).isConfirmed

// ---- ตัวช่วย token / วันที่ ----
export const me = () => {
    const token = localStorage.getItem('authtoken')
    return token ? jwtDecode(token) : {}
}
export const logout = () => {
    localStorage.removeItem('authtoken')
    router.push('/login')
}
export const thaidate = (d) =>
    d ? new Date(d).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' }) : '-'
export const thaiday = (d) => (d ? new Date(d).toLocaleDateString('th-TH', { dateStyle: 'long' }) : '-')

// ปีที่ประเมิน = คอลัมน์ eyal_year
export const YEAR = new Date().getFullYear()

// ---- เมนู sidebar ของเจ้าหน้าที่ ----
export const officermenu = [
    { to: '/officer', label: 'หัวข้อประเมิน' },
    { to: '/officer/match', label: 'จับคู่กรรมการ' },
    { to: '/officer/matchquiz', label: 'จับคู่หัวข้อ' },
    { to: '/officer/role', label: 'สิทธิ์ผู้ใช้งาน' },
    { to: '/officer/time', label: 'วันเปิดประเมิน' },
    { to: '/officer/report', label: 'ตารางสรุป' },
]

// ---- ดึงรายการมาใส่ dropdown: const users = useList('/api/users') ----
export const useList = (url) => {
    const items = ref([])
    onMounted(async () => {
        try {
            items.value = (await api.get(url)).data.message
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
        try {
            rows.value = (await api.get(u.list)).data.message
        } catch (e) {
            err(e)
        }
    }

    const add = async () => {
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
        if (!(await ask('ยืนยันการลบรายการนี้?'))) return
        try {
            await api.delete(u.del, { params: { id: row.id } })
            ok('ลบสำเร็จ')
            load()
        } catch (e) {
            err(e)
        }
    }

    onMounted(load)
    return { rows, form, load, add, edit, del }
}