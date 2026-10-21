

<template>
    <div class="min-h-screen flex flex-col items-center   w-full justify-center p-10">
        <div>
            <h1>Register</h1>
        </div>
 <form @submit.prevent="handleregister()" class="w-70 items-center justify-center ">
                <div>
                <h1>ชื่อผู้ใช้งาน</h1>
                        <input class="border rounded-xl w-full" v-model=" username" placeholder="ตั้งชื่อผู้ใช้งาน..." type="text" />
            </div>
            <div>
                <h1>ชื่อจริง</h1>
                        <input class="border rounded-xl w-full" v-model="firstname" placeholder="ชื่อจริง..." type="text" />
            </div>
            <div>
                <h1>นามสกุล</h1>
                        <input class="border rounded-xl w-full" v-model="lastname" placeholder="นามสกุล..." type="text" />
            </div>
            <div>
                <h1>ตำแหน่ง</h1>
                        <input class="border rounded-xl w-full" v-model="position" placeholder="ตำแหน่ง..." type="text" />
            </div>
            <div>
                <h1>ผแนก</h1>
                        <input class="border rounded-xl w-full" v-model="department" placeholder="ผแนก..." type="text" />
            </div>
            <div>
                <h1>รหัสผ่าน</h1>
                        <input class="border rounded-xl w-full" v-model="password" placeholder="ตั้งรหัสผ่าน..." type="password" />
            </div>
            <button class=" border hover:bg-blue-500 text-white bg-blue-600 rounded-xl p-2 w-full " >สมัคร</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const firstname = ref('')
const lastname = ref('')
const password = ref('')
const department = ref('')
const position =ref('')

const handleregister = async () => {
    Swal.fire({
        title: 'กำลังโหลด...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.isLoading();
        }
    })

    if(!username.value || !password.value || !firstname.value || !lastname.value){
        Swal.fire({
            icon:'warning',
            title:'กรุณากรอกข้อมูลให้ครบถ้วน'
        })
        return;
    }
    try{
        const res = await axios.post(`${import.meta.env.VITE_API}/api/register`,{
            username: username.value,
            firstname: firstname.value,
            lastname: lastname.value,
            password: password.value,
            department: department.value,
            position: position.value
        })


        if(res.data.success){
            Swal.fire({
                icon: 'success',
                title: 'สมัครสำเร็จ',
                timer: '1500',
                showConfirmButton: false
            })
            router.push('/login')
        }
    } catch(e){
        console.error(e)

        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: e.res?.data?.message
        })
    }
}
</script>
