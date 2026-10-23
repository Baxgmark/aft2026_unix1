<script setup>
import { ref, onMounted } from 'vue'
import Layout from '../../components/Layout.vue'
import { api, ok, err, pickrows, officermenu } from '../../lib'

const roles = [
    { id: 'user', label: 'ผู้รับการประเมิน' },
    { id: 'boss', label: 'กรรมการผู้ประเมิน' },
    { id: 'officer', label: 'เจ้าหน้าที่' },
]

const positionss = [
    { id: 'กรรมการร่วม', label: 'กรรมการร่วม' },
    { id: 'ประธาน', label: 'ประธาน' },
]

const rows = ref([])


const getdata = async () => {
    try {
        rows.value = pickrows((await api.get('/api/getalluser')).data)
        console.log(rows.value)
    } catch (e) {
        err(e)
    }
}
onMounted(getdata)


const save = async (r) => {
    try {
        await api.put('/api/updateuser', { id: r.id, role: r.role, position: r.position})
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
                        <th class="th">แผนก</th>
                        <th class="th">สิทธิ์</th>
                         <th class="th">บทบาท</th>
                        <th class="th">บันทึก</th>
                        <th class="th">รหัสผ่าน</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in rows" :key="r.id">
                        <td class="td">{{ r.firstname }} {{ r.lastname }} ({{ r.username }})</td>
                        <td class="td">{{ r.department }}</td>
                        <td class="td">
                            <select class="inp" v-model="r.role">
                                <option v-for="x in roles" :key="x.id" :value="x.id">{{ x.label }}</option>
                            </select>
                        </td>
                        <td class="td">
                            <select class="inp" v-model="r.position">
                                <option v-for="x in positionss" :key="x.id" :value="x.id">{{ x.label }}</option>
                            </select>
                        </td>
                        <td class="td"><button class="btn" @click="save(r)">บันทึก</button></td>
                        <td class="td">
                            <RouterLink class="btn inline-block" :to="{ name: 'chagpass', params: { id: r.id } }">
                                เปลี่ยนรหัสผ่าน
                            </RouterLink>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Layout>
</template>
