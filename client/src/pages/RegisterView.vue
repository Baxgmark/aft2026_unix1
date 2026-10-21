

<template>
    <div>
        <div>
            <h1>Register</h1>
        </div>
        <form>
            <div>
                <h1>ชื่อผู้ใช้งาน</h1>
                        <input placeholder="ตั้งชื่อผู้ใช้งาน..." type="text" class="" />
            </div>
            <div>
                <h1>ชื่อจริง</h1>
                        <input placeholder="ชื่อจริง..." type="text" class="" />
            </div>
            <div>
                <h1>นามสกุล</h1>
                        <input placeholder="นามสกุล..." type="text" class="" />
            </div>
            <div>
                <h1>รหัสผ่าน</h1>
                        <input placeholder="ตั้งรหัสผ่าน..." type="password" class="" />
            </div>
            <button>สมัคร</button>
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
            icon:'warning'
            title:'กรุณากรอกข้อมูลให้ครบถ้วน'
        })
        return;
    }
    try{
        const res = await axios.post(`${import.meta.env.VITE_API}/api/register`,{
            username: username.value
            firstname: firstname.value,
            lastname: lastname.value,
            password: password.value
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
