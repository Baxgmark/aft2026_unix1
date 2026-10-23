import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { jwtDecode } from 'jwt-decode'
import router from './routes'

export const api = axios.create({ baseURL: import.meta.env.VITE_API })

api.interceptors.request.use((config) => {
    // url ที่ยังไม่ได้ตั้ง (ว่าง หรือเป็นจุด ๆ) -> ยกเลิกทิ้ง ไม่ยิงออกไป จะได้ไม่มี error ใน network
    if (!config.url || !config.url.includes('api/')) {
        throw new axios.CanceledError('ยังไม่ได้ตั้ง url')
    }

    const token = localStorage.getItem('authtoken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    (e) => {
        return Promise.reject(e)
    }
)

// ---- ตัวช่วย Swal สั้นๆ ----
export const ok = (title) => Swal.fire({ icon: 'success', title, timer: 1500, showConfirmButton: false })
export const warn = (title) => Swal.fire({ icon: 'warning', title })
// ถ้า backend ไม่ได้ส่ง message มา ให้โชว์ method + url + status จะได้รู้ว่าพังตรงไหน
export const err = (e) => {
    if (axios.isCancel(e)) return // request ที่เรายกเลิกเอง ไม่ต้องเด้งบอกผู้ใช้
    const m = e.response?.data?.message
    Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        // express-validator ส่ง message มาเป็น object { errors: [...] } ต้องดึง msg ออกมาเอง
        text: m?.errors?.map((x) => x.msg).join('\n') ||
            (typeof m === 'string' ? m : '') ||
            `${e.config?.method?.toUpperCase() || ''} ${e.config?.url || ''} → ${e.response?.status || e.message}`,
    })
}
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
    { to: '/officer/creatuser', label: 'สร้างบัญชีผู้ใช้' },
]

// ---- ดึงรายการมาใส่ dropdown: const users = useList('/api/users') ----
// backend คืน array มาคนละคีย์แต่ละ route (rows / message / data) -> หยิบ field ที่เป็น array มาเอง
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
        if (!(await ask('ยืนยันการลบรายการนี้?'))) return
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