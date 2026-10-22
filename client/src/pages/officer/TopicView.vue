<script setup>
import Layout from '../../components/Layout.vue'
import { useCrud, officermenu } from '../../lib'

// ตาราง topic (name, detail, weight, type)
const types = [
    { id: '1', label: '1-4 คะแนน' },
    { id: '2', label: 'ผ่าน / ไม่ผ่าน' },
]

const { rows, form, add, edit, del } = useCrud({
    add: 'api/addtopic',
    list: 'api/alltopic'   
})
</script>

<template>
    <Layout title="เจ้าหน้าที่" :menu="officermenu">
        <h1 class="text-xl font-bold">หัวข้อการประเมิน</h1>

        <form class="card grid md:grid-cols-5 gap-3 items-end" @submit.prevent="add()">
            <div class="md:col-span-2">
                <p class="label">ชื่อหัวข้อ</p>
                <input class="inp" v-model="form.name" placeholder="ชื่อหัวข้อ..." />
            </div>
            <div>
                <p class="label">รายละเอียด</p>
                <input class="inp" v-model="form.detail" placeholder="รายละเอียด..." />
            </div>
                        <div>
                <p class="label">URL</p>
                <input class="inp" v-model="form.base_url" type="text" placeholder="น้ำหนัก" />
            </div>
            <div>
                <p class="label">น้ำหนัก</p>
                <input class="inp" v-model="form.weight" type="number" placeholder="น้ำหนัก" />
            </div>
            <div>
                <p class="label">รูปแบบคะแนน</p>
                <select class="inp" v-model="form.type">
                    <option v-for="t in types" :key="t.id" :value="t.id">{{ t.label }}</option>
                </select>
            </div>
            <button class="btn md:col-span-5">เพิ่มหัวข้อ</button>
        </form>

        <div class="card">
            <h2 class="font-bold mb-2">รายการทั้งหมด</h2>

            <div v-for="r in rows" :key="r.id" class="grid md:grid-cols-5 gap-3 items-end border-t border-gray-200 py-3">
                <input class="inp md:col-span-2" v-model="r.name" />
                <input class="inp" v-model="r.detail" />
                <input class="inp" v-model="r.weight" type="number" />
                <select class="inp" v-model="r.type">
                    <option v-for="t in types" :key="t.id" :value="t.id">{{ t.label }}</option>
                </select>
                <div class="flex gap-2 md:col-span-5">
                    <button class="btn-gray flex-1" @click="edit(r)">แก้ไข</button>
                    <button class="btn-red flex-1" @click="del(r)">ลบ</button>
                </div>
            </div>

            <p v-if="!rows.length" class="label">ยังไม่มีข้อมูล</p>
        </div>
    </Layout>
</template>
