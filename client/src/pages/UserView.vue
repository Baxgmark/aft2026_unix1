<script setup>
import { ref, onMounted } from 'vue'
import Layout from '../components/Layout.vue'
import ScoreInput from '../components/ScoreInput.vue'
import { api, ok, err, warn, pickrows, YEAR } from '../lib'

const profile = ref({})
const rows = ref([])

const getprofile = async () => {
    try {
        profile.value = (await api.get('')).data.message
    } catch (e) {
        err(e)
    }
}

const getdata = async () => {
    try {
        rows.value = pickrows((await api.get('/api/usertopic')).data)
    } catch (e) {
        err(e)
    }
}

onMounted(() => {
    getprofile()
    getdata()
})

const submit = async () => {
    try {
        for (const r of rows.value) {
            await api.post('/api/usersavetopic', { id: r.id, topic_id: r.topic_id, self_score: r.self_score, base_url: r.url })
        }
        ok('บันทึกแบบประเมินสำเร็จ')

        getdata()
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
                <p>{{ r.base_url }}</p>

                <div class="grid md:grid-cols-3 gap-3 items-end">
                    <div>
                        <p class="label">คะแนนที่ประเมินตนเอง</p>
                        <ScoreInput v-model="r.self_score" :type="r.type" />
                    </div>
                    <div>
                        <p class="label">ลิงก์</p>
                        <input class="inp" v-model="r.url" placeholder="วางลิงก์" />
                    </div>
                    
                </div>
                            
            </div>

            <p v-if="!rows.length" class="label">ยังไม่ได้รับมอบหมายหัวข้อประเมิน</p>

<button class="btn self-start">บันทึกแบบประเมิน</button>
        </form>
    </Layout>
</template>
