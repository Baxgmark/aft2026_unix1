<script setup>
import { ref, onMounted } from 'vue'
import Layout from '../../components/Layout.vue'
import { api, ok, err, officermenu } from '../../lib'

// ตาราง users มีคอลัมน์ role อยู่แล้ว หน้านี้คือเปลี่ยนค่าในคอลัมน์นั้น
const roles = [
    { id: 'user', label: 'ผู้รับการประเมิน' },
    { id: 'boss', label: 'กรรมการผู้ประเมิน' },
    { id: 'officer', label: 'เจ้าหน้าที่' },
]

const rows = ref([])

const getdata = async () => {
    try {
        rows.value = (await api.get('/api/all')).data.message
    } catch (e) {
        err(e)
    }
}
onMounted(getdata)

const save = async (r) => {
    try {
        await api.put('/api/role', { id: r.id, role: r.role })
        ok('เปลี่ยนสิทธิ์สำเร็จ')
    } catch (e) {
        err(e)
    }
}
</script>

<template>
    <Layout title="เจ้าหน้าที่" :menu="officermenu">
        <h1 class="text-xl font-bold">กำหนดสิทธิ์ผู้ใช้งาน</h1>

        <div class="card overflow-auto">
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="th">ชื่อ-นามสกุล</th>
                        <th class="th">ตำแหน่ง / แผนก</th>
                        <th class="th">สิทธิ์</th>
                        <th class="th"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in rows" :key="r.id">
                        <td class="td">{{ r.firstname }} {{ r.lastname }} ({{ r.username }})</td>
                        <td class="td">{{ r.position }} / {{ r.department }}</td>
                        <td class="td">
                            <select class="inp" v-model="r.role">
                                <option v-for="x in roles" :key="x.id" :value="x.id">{{ x.label }}</option>
                            </select>
                        </td>
                        <td class="td"><button class="btn" @click="save(r)">บันทึก</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Layout>
</template>
