<template>
    <div class="min-h-screen flex flex-col items-center justify-center gap-6 p-10">
        <h1 class="text-3xl font-bold">ระบบประเมินบุคลากร</h1>
        <p class="label">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
        <div class="flex gap-3">
            <RouterLink class="btn" to="/login">เข้าสู่ระบบ</RouterLink>
            <RouterLink class="btn-gray" to="/register">สมัครบัญชี</RouterLink>
        </div>
        <div class="card text-sm text-gray-600">
            <p class="font-bold mb-1">บัญชีทดลอง (รหัสผ่าน 1234)</p>
            <p>user, user2 = ผู้รับการประเมิน</p>
            <p>boss, boss2 = กรรมการผู้ประเมิน</p>
            <p>officer = เจ้าหน้าที่ (จัดการทุกอย่าง)</p>
        </div>
    </div>
</template>
