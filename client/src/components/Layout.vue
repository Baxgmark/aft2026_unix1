<script setup>
import { ref } from 'vue'
import { logout } from '../lib'

// menu = [{ to:'/officer', label:'หัวข้อประเมิน' }, ...]
defineProps(['title', 'menu'])
const open = ref(false)
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <header class="bg-blue-600 text-white flex items-center justify-between p-4">
            <div class="flex items-center gap-3">
                <button class="text-2xl lg:hidden" @click="open = !open">☰</button>
                <h1 class="text-xl font-bold">{{ title }}</h1>
            </div>
            <button class="btn-red" @click="logout()">ออกจากระบบ</button>
        </header>

        <div class="flex flex-1">
            <aside v-if="menu?.length"
                :class="['bg-blue-500 text-white w-60 p-3 flex flex-col gap-1 fixed lg:static top-0 left-0 h-full z-10 transition-transform duration-300',
                    open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
                <button class="text-2xl self-end lg:hidden" @click="open = false">✕</button>
                <RouterLink v-for="m in menu" :key="m.to" :to="m.to" class="rounded-lg p-2 hover:bg-blue-600"
                    exact-active-class="bg-blue-700" @click="open = false">
                    {{ m.label }}
                </RouterLink>
            </aside>

            <main class="flex-1 p-6 flex flex-col gap-4 min-w-0">
                <slot />
            </main>
        </div>
    </div>
</template>
