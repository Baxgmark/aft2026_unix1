<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import Layout from '../../components/Layout.vue'
import { api, ok, err, ask, officermenu } from '../../lib'

const report = ref({ table: [], noassign: [] })
const fileinput = ref(null)

const getdata = async () => {
    try {
        report.value = (await api.get('.....')).data.message
    } catch (e) {
        err(e)
    }
}
onMounted(getdata)

const detail = () =>
    Swal.fire({
        title: 'ผู้รับการประเมินที่ยังไม่มีผู้ประเมิน',
        html: report.value.noassign.map((u) => `${u.firstname} ${u.lastname} (${u.department})`).join('<br/>') || 'ไม่มี',
    })

const backup = async () => {
    try {
        const res = await api.get('/api/backup')
        const url = URL.createObjectURL(new Blob([JSON.stringify(res.data.message, null, 2)], { type: 'application/json' }))
        Object.assign(document.createElement('a'), { href: url, download: 'backup.json' }).click()
        ok('สำรองข้อมูลแล้ว')
    } catch (e) {
        err(e)
    }
}

const restore = async () => {
    const f = fileinput.value?.files?.[0]
    if (!f) return
    if (!(await ask('กู้คืนข้อมูลจากไฟล์นี้? ข้อมูลเดิมจะถูกแทนที่'))) return
    try {
        await api.post('/api/restore', { data: JSON.parse(await f.text()) })
        ok('กู้คืนสำเร็จ กำลังโหลดใหม่')
        setTimeout(() => location.reload(), 1200)
    } catch (e) {
        err(e)
    }
}
</script>

<template>
    <Layout title="เจ้าหน้าที่" :menu="officermenu">
        <h1 class="text-xl font-bold">ตารางสรุปการประเมิน</h1>

        <div class="card overflow-auto">
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="th">ข้อที่</th>
                        <th class="th">ผู้รับการประเมิน</th>
                        <th class="th">หัวข้อ</th>
                        <th class="th">กรรมการผู้ประเมิน</th>
                        <th class="th">คะแนนผู้รับการประเมิน</th>
                        <th class="th">คะแนนกรรมการ</th>
                        <th class="th">สถานะผู้รับการประเมิน</th>
                        <th class="th">สถานะกรรมการ</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="r in report.table" :key="r.no">
                        <td class="td">{{ r.no }}</td>
                        <td class="td">{{ r.user }}</td>
                        <td class="td">{{ r.topic }}</td>
                        <td class="td">{{ r.boss }}</td>
                        <td class="td">{{ r.selfscore }}</td>
                        <td class="td">{{ r.bossscore }}</td>
                        <td class="td" :class="r.selfdone === 'เสร็จแล้ว' ? 'text-green-600' : 'text-red-600'">{{ r.selfdone }}</td>
                        <td class="td" :class="r.bossdone === 'เสร็จแล้ว' ? 'text-green-600' : 'text-red-600'">{{ r.bossdone }}</td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!report.table.length" class="label">ยังไม่มีการจับคู่</p>
        </div>

        <!-- 8.5 รายงานผู้ที่ยังไม่มีผู้ประเมิน -->
        <div class="card flex items-center justify-between">
            <div>
                <h2 class="font-bold">ผู้รับการประเมินที่ยังไม่มีผู้ประเมิน</h2>
                <p class="text-2xl font-bold text-red-600">{{ report.noassign.length }} คน</p>
            </div>
            <button class="btn" @click="detail()">ดูรายละเอียด</button>
        </div>

        <!-- 8.4 สำรอง / กู้คืน -->
        <div class="card flex flex-col gap-2">
            <h2 class="font-bold">สำรอง / กู้คืนข้อมูล (JSON)</h2>
            <button class="btn self-start" @click="backup()">ดาวน์โหลดไฟล์สำรอง</button>
            <input class="inp" ref="fileinput" type="file" accept="application/json" @change="restore()" />
        </div>
    </Layout>
</template>
