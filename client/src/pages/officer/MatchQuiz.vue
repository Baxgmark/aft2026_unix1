<script setup>
import Layout from '../../components/Layout.vue'
import { useCrud, useList, officermenu, YEAR } from '../../lib'

// จับคู่ = สร้างแถวว่างใน self_answer (ผู้รับการประเมินค่อยมากรอกคะแนนเอง)
const { rows, form, add, edit, del } = useCrud('/api/selfanswer', {
    eyal_year: YEAR,
    self_score: '',
    base_url: '',
})
const users = useList('/api/users')
const topics = useList('/api/topic')
</script>

<template>
    <Layout title="เจ้าหน้าที่" :menu="officermenu">
        <h1 class="text-xl font-bold">จับคู่ผู้รับการประเมิน กับ หัวข้อประเมิน</h1>
        <p class="label">ปีที่ประเมิน {{ YEAR }}</p>

        <form class="card grid md:grid-cols-3 gap-3 items-end" @submit.prevent="add()">
            <div>
                <p class="label">ชื่อผู้รับการประเมิน</p>
                <select class="inp" v-model="form.user_id">
                    <option v-for="u in users" :key="u.id" :value="u.id">{{ u.firstname }} {{ u.lastname }}</option>
                </select>
            </div>
            <div>
                <p class="label">ชื่อหัวข้อ</p>
                <select class="inp" v-model="form.topic_id">
                    <option v-for="t in topics" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
            </div>
            <button class="btn">เพิ่มการจับคู่</button>
        </form>

        <div class="card">
            <h2 class="font-bold mb-2">รายการทั้งหมด</h2>

            <div v-for="r in rows" :key="r.id" class="grid md:grid-cols-4 gap-3 items-end border-t border-gray-200 py-3">
                <select class="inp" v-model="r.user_id">
                    <option v-for="u in users" :key="u.id" :value="u.id">{{ u.firstname }} {{ u.lastname }}</option>
                </select>
                <select class="inp" v-model="r.topic_id">
                    <option v-for="t in topics" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
                <p class="label">คะแนนที่ประเมินตนเอง: {{ r.self_score || 'ยังไม่ได้ทำ' }}</p>
                <div class="flex gap-2">
                    <button class="btn-gray flex-1" @click="edit(r)">แก้ไข</button>
                    <button class="btn-red flex-1" @click="del(r)">ลบ</button>
                </div>
            </div>

            <p v-if="!rows.length" class="label">ยังไม่มีข้อมูล</p>
        </div>
    </Layout>
</template>
