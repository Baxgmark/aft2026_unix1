<script setup>
import { ref, onMounted } from 'vue'
import Layout from '../../components/Layout.vue'
import { api, ok, err, warn, ask, thaidate, pickrows, officermenu } from '../../lib'

const rows = ref([])
const form = ref({ time1: '', time2: '' })

const getdata = async () => {
    try {
        rows.value = pickrows((await api.get('/api/conftime')).data)
    } catch (e) {
        err(e)
    }
}
onMounted(getdata)

const add = async () => {
    if (!form.value.time1 || !form.value.time2) return warn('กรุณาเลือกทั้งวันเริ่มและวันปิด')
    if (form.value.time1 >= form.value.time2) return warn('วันเริ่มต้องมาก่อนวันปิด')
    try {
        await api.post('/api/conftime', form.value)
        ok('เพิ่มช่วงเวลาสำเร็จ')
        form.value = { time1: '', time2: '' }
        getdata()
    } catch (e) {
        err(e)
    }
}

const edit = async (r) => {
    try{
        await api.edit('/api/edittime' , { params: {id: r.id} })
        ok('แก้ไขสำเร็จ')
        getdata()
    } catch (e){
        err(e)
    }
}

const del = async (r) => {
    if (!(await ask('ยืนยันการลบช่วงเวลานี้?'))) return
    try {
        await api.delete('....', { params: { id: r.id } })
        ok('ลบสำเร็จ')
        getdata()
    } catch (e) {
        err(e)
    }
}
</script>

<template>
    <Layout title="เจ้าหน้าที่" :menu="officermenu">
        <h1 class="text-xl font-bold">ช่วงเวลาเปิดให้ประเมิน</h1>

        <form class="card grid md:grid-cols-3 gap-3 items-end" @submit.prevent="add()">
            <div>
                <p class="label">วันเริ่ม</p>
                <input class="inp" v-model="form.time1" type="date" />
            </div>
            <div>
                <p class="label">วันปิด</p>
                <input class="inp" v-model="form.time2" type="date" />
            </div>
            <button class="btn">เพิ่มช่วงเวลา</button>
        </form>

        <div class="card">
            <h2 class="font-bold mb-2">รายการทั้งหมด</h2>

            <div v-for="r in rows" :key="r.id" class="flex gap-3 items-center border-t border-gray-200 py-3">
                <p class="flex-1">{{ thaidate(r.time_start) }} ถึง {{ thaidate(r.time_end) }}</p>
                <button class="btn-gray flex-1" @click="edit(r)">แก้ไข</button>
                <button class="btn-red" @click="del(r)">ลบ</button>
            </div>

            <p v-if="!rows.length" class="label">ยังไม่มีข้อมูล</p>
        </div>
    </Layout>
</template>
