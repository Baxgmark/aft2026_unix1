<script setup>
// type 1 = 1-4 คะแนน, type 2 = ผ่าน / ไม่ผ่าน
defineProps(['type'])
const model = defineModel({ default: '' })
</script>

<template>
    <select class="inp" v-model="model">
        <option value="">- เลือก -</option>
        <template v-if="type === '1'">
            <option v-for="n in 4" :key="n" :value="n">{{ n }} คะแนน</option>
        </template>
        <template v-else>
            <option value="ผ่าน">ผ่าน</option>
            <option value="ไม่ผ่าน">ไม่ผ่าน</option>
        </template>
    </select>
</template>
