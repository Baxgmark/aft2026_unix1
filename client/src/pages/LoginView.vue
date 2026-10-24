<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { api } from '../lib'

const router = useRouter()
const form = ref({ username: '', password: '' })

const handlelogin = async () => {
    if (!form.value.username || !form.value.password){
        alert('กรุณากรอกข้อมูลให้ครบถ้วน')
        return;
    }
    try {
        const res = await api.post('/api/login', form.value)
        localStorage.setItem('authtoken', res.data.token)
        ok('เข้าสู่ระบบสำเร็จ')
        const role =  jwtDecode(res.data.token).role
        router.push('/' + role)
    } catch (e) {
        err(e)
    }
}

</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-10">
        <h1 class="text-2xl font-bold mb-4">เข้าสู่ระบบ</h1>
        <form class="w-80 flex flex-col gap-3" @submit.prevent="handlelogin()">
            <div>
                <p class="label">ชื่อผู้ใช้งาน</p>
                <input class="inp" v-model="form.username" placeholder="ชื่อผู้ใช้งาน..." type="text" />
            </div>
            <div>
                <p class="label">รหัสผ่าน</p>
                <input class="inp" v-model="form.password" placeholder="รหัสผ่าน..." type="password" />
            </div>
            <button class="btn w-full">เข้าสู่ระบบ</button>
            <RouterLink class="label text-center hover:underline" to="/register">ยังไม่มีบัญชี? สมัครที่นี่</RouterLink>
        </form>
    </div>
</template>

