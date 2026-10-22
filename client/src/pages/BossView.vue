<script setup>
import { ref, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import ScoreInput from '../components/ScoreInput.vue'
import { api, ok, err, ask, YEAR } from '../lib'

const rows = ref([]) // boss_answers ที่กรรมการคนนี้ต้องประเมิน + ข้อมูล topic

const getdata = async () => {
    try {
        rows.value = (await api.get('/api/mywork')).data.data
    } catch (e) {
        err(e)
    }
}
onMounted(getdata)

// บันทึกเฉพาะคอลัมน์ที่อยู่ในตาราง boss_answers จริงๆ
const submit = async () => {
    if (!(await ask('ยืนยันบันทึกคะแนนทั้งหมด?'))) return
    try {
        for (const r of rows.value) {
            await api.put('/api/bossanswer', { id: r.id, score: r.score, reviews: r.reviews, sign: r.sign })
        }
        ok('บันทึกคะแนนสำเร็จ')
        getdata()
    } catch (e) {
        err(e)
    }
}
</script>

<template>
    <Layout title="หน้ากรรมการผู้ประเมิน">
        <h1 class="text-xl font-bold">แบบประเมินที่ต้องให้คะแนน</h1>
        <p class="label">ปีที่ประเมิน {{ YEAR }}</p>

        <form class="card flex flex-col gap-4" @submit.prevent="submit()">
            <div v-for="r in rows" :key="r.id" class="border-t border-gray-200 pt-3 flex flex-col gap-2">
                <p class="font-bold">{{ r.username }} — {{ r.name }} <span class="label">(น้ำหนัก {{ r.weight }})</span></p>
                <p class="label">{{ r.detail }}</p>

                <div class="grid md:grid-cols-3 gap-3 items-end">
                    <div>
                        <p class="label">คะแนน</p>
                        <ScoreInput v-model="r.score" :type="r.type" />
                    </div>
                    <div>
                        <p class="label">ความเห็น</p>
                        <input class="inp" v-model="r.reviews" placeholder="ความเห็นเพิ่มเติม..." />
                    </div>
                    <div>
                        <p class="label">ลายเซ็น</p>
                        <input class="inp" v-model="r.sign" placeholder="ชื่อผู้ประเมิน..." />
                    </div>
                </div>
            </div>

            <p v-if="!rows.length" class="label">ยังไม่ได้รับมอบหมายให้ประเมินใคร</p>

            <button v-if="rows.length" class="btn self-start">บันทึกคะแนน</button>
        </form>
    </Layout>
</template>
