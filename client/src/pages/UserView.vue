<script setup>
import { ref, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import ScoreInput from '../components/ScoreInput.vue'
import { api, ok, err, warn, YEAR } from '../lib'

const profile = ref({})
const rows = ref([]) // self_answer ของตัวเอง + ข้อมูล topic

const getdata = async () => {
    try {
        const [me, self] = await Promise.all([api.get('....'), api.get('....')])
        profile.value = me.data.message
        rows.value = self.data.message
    } catch (e) {
        err(e)
    }
}
onMounted(getdata)

// บันทึกเฉพาะคอลัมน์ที่อยู่ในตาราง self_answer จริงๆ
const submit = async () => {
    try {
        for (const r of rows.value) {
            await api.put('.....', { id: r.id, self_score: r.self_score, base_url: r.base_url })
        }
        ok('บันทึกแบบประเมินสำเร็จ')
        getdata()
    } catch (e) {
        err(e)
    }
}

// 8.3 upload เฉพาะ .pdf ไม่เกิน 1mb และเปลี่ยนชื่อไฟล์ -> เก็บชื่อใหม่ลง base_url
const upload = async (e, r) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.type !== 'application/pdf') return warn('อัปโหลดได้เฉพาะไฟล์ .pdf')
    if (f.size > 1024 * 1024) return warn('ไฟล์ต้องมีขนาดไม่เกิน 1MB')
    try {
        const res = await api.post('/api/upload', { name: f.name })
        r.base_url = res.data.filename
        ok('อัปโหลดสำเร็จ กด "บันทึกแบบประเมิน" เพื่อยืนยัน')
    } catch (e) {
        err(e)
    }
}
</script>

<template>
    <Layout title="หน้าผู้รับการประเมิน">
        <div class="card">
            <h2 class="font-bold mb-2">ข้อมูลของฉัน</h2>
            <p>ชื่อ: {{ profile.firstname }} {{ profile.lastname }}</p>
            <p>ตำแหน่ง: {{ profile.position }} / แผนก: {{ profile.department }}</p>
            <p>กรรมการผู้ประเมิน:
                <span v-if="profile.boss">{{ profile.boss }}</span>
                <span v-else class="text-red-600">ยังไม่มีผู้ประเมิน</span>
            </p>
            <p class="label mt-2">ปีที่ประเมิน {{ YEAR }}</p>
        </div>

        <form class="card flex flex-col gap-4" @submit.prevent="submit()">
            <h2 class="font-bold">แบบประเมินตนเอง</h2>

            <div v-for="r in rows" :key="r.id" class="border-t border-gray-200 pt-3 flex flex-col gap-2">
                <p class="font-bold">{{ r.name }} <span class="label">(น้ำหนัก {{ r.weight }})</span></p>
                <p class="label">{{ r.detail }}</p>

                <div class="grid md:grid-cols-3 gap-3 items-end">
                    <div>
                        <p class="label">คะแนนที่ประเมินตนเอง</p>
                        <ScoreInput v-model="r.self_score" :type="r.type" />
                    </div>
                    <div>
                        <p class="label">ลิงก์ / ไฟล์เอกสารอ้างอิง</p>
                        <input class="inp" v-model="r.base_url" placeholder="วางลิงก์ หรืออัปโหลดไฟล์..." />
                    </div>
                    <div>
                        <p class="label">แนบไฟล์ .pdf (ไม่เกิน 1MB)</p>
                        <input class="inp" type="file" accept="application/pdf" @change="upload($event, r)" />
                    </div>
                </div>
            </div>

            <p v-if="!rows.length" class="label">ยังไม่ได้รับมอบหมายหัวข้อประเมิน</p>

            <button class="btn self-start">บันทึกแบบประเมิน</button>
        </form>
    </Layout>
</template>
