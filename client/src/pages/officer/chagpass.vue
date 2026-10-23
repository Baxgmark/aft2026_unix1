<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '../../components/Layout.vue'
import { api, ok, err, warn, officermenu } from '../../lib'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const password = ref('')

const save = async () => {
    if (!password.value) return warn('กรุณากรอกรหัสผ่านใหม่')
    try {
        await api.put('/api/updateuser', { id, password: password.value })
        ok('เปลี่ยนรหัสผ่านสำเร็จ')
        router.push('/officer/role')
    } catch (e) {
        err(e)
    }
}
</script>

<template>
    <Layout title="เจ้าหน้าที่" :menu="officermenu">
        <center>
        <h1 class="text-xl font-bold">เปลี่ยนรหัสผ่าน</h1>
        <p class="label">ผู้ใช้งานรหัส {{ id }}</p>

        <form class="card w-80 flex flex-col gap-3" @submit.prevent="save()">
            <div>
                <p class="label">รหัสผ่านใหม่</p>
                <input class="inp" v-model="password" type="password" placeholder="รหัสผ่านใหม่..." />
            </div>
            <button class="btn w-full">เปลี่ยนรหัส</button>
        </form>
        </center>
    </Layout>
</template>
