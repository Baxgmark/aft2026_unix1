<script setup>
import { ref, onMounted } from 'vue'
import Layout from '../../components/Layout.vue'
import { api, ok, err, ask, thaiday, officermenu } from '../../lib'

// ตาราง timetodo มีคอลัมน์เดียวคือ time (date) จึงเก็บได้แค่ "วันที่เปิดให้ประเมิน"
// เป็นรายการวัน ไม่ได้แยกรายคน และไม่มี id เลยใช้ค่า time เป็นตัวอ้างอิงตอนลบ
const rows = ref([])
const time = ref('')

const getdata = async () => {
    try {
        rows.value = (await api.get('/api/timetodo')).data.data
    } catch (e) {
        err(e)
    }
}
onMounted(getdata)

const add = async () => {
    try {
        await api.post('/api/timetodo', { time: time.value })
        ok('เพิ่มวันที่สำเร็จ')
        time.value = ''
        getdata()
    } catch (e) {
        err(e)
    }
}

const del = async (r) => {
    if (!(await ask('ยืนยันการลบวันที่นี้?'))) return
    try {
        await api.delete('/api/timetodo', { params: { time: r.time } })
        ok('ลบสำเร็จ')
        getdata()
    } catch (e) {
        err(e)
    }
}
</script>

<template>
    <Layout title="เจ้าหน้าที่" :menu="officermenu">
        <h1 class="text-xl font-bold">วันที่เปิดให้ประเมิน</h1>

        <form class="card flex flex-col md:flex-row gap-3 items-end" @submit.prevent="add()">
            <div class="flex-1">
                <p class="label">เลือกวันที่</p>
                <input class="inp" v-model="time" type="date" />
            </div>
            <button class="btn">เพิ่มวันที่</button>
        </form>

        <div class="card">
            <h2 class="font-bold mb-2">รายการทั้งหมด</h2>

            <div v-for="r in rows" :key="r.time" class="flex gap-3 items-center border-t border-gray-200 py-3">
                <p class="flex-1">{{ thaiday(r.time) }}</p>
                <button class="btn-red" @click="del(r)">ลบ</button>
            </div>

            <p v-if="!rows.length" class="label">ยังไม่มีข้อมูล</p>
        </div>
    </Layout>
</template>
