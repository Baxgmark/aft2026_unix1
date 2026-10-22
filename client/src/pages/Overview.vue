<template>
    <div class="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
        <h1 class="text-3xl font-bold">ระบบประเมินบุคลากร</h1>
        <p class="label">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        <div class="flex gap-3">
            <RouterLink class="btn" to="/login">เข้าสู่ระบบ</RouterLink>
            <RouterLink class="btn-gray" to="/register">สมัครบัญชี</RouterLink>
        </div>
    </div>
</template>
