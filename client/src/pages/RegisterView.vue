<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api, ok, err, warn } from '../lib'

const router = useRouter()

// key = ชื่อฟิลด์ที่ส่งไป backend, value = ป้ายที่แสดงบนหน้า
const fields = {
    username: 'ชื่อผู้ใช้งาน',
    firstname: 'ชื่อจริง',
    lastname: 'นามสกุล',
    position: 'ตำแหน่ง',
    department: 'แผนก',
    password: 'รหัสผ่าน',
}

const form = ref({})

const handleregister = async () => {
    if (Object.keys(fields).some((k) => !form.value[k])) return warn('กรุณากรอกข้อมูลให้ครบถ้วน')
    try {
        await api.post('/api/register', form.value)
        ok('สมัครสำเร็จ')
        router.push('/login')
    } catch (e) {
        err(e)
    }
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-10">
        <h1 class="text-2xl font-bold mb-4">สมัครบัญชี</h1>
        <form class="w-80 flex flex-col gap-3" @submit.prevent="handleregister()">
            <div v-for="(label, key) in fields" :key="key">
                <p class="label">{{ label }}</p>
                <input class="inp" v-model="form[key]" :placeholder="label + '...'"
                    :type="key === 'password' ? 'password' : 'text'" />
            </div>
            <button class="btn w-full">สมัคร</button>
            <RouterLink class="label text-center hover:underline" to="/login">มีบัญชีแล้ว? เข้าสู่ระบบ</RouterLink>
        </form>
    </div>
</template>
