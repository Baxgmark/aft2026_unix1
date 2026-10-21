

<template>
  <div>
    <div className="text-6xl text-green-500">Hello บัง!</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';

const router = useRouter()
const username = ref('')
const password = ref('')


const handlelogin = async () => {
  Swal.fire({
    title: 'กำลังประมวลผล',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.isLoading();
    }

  })

  if(!username.value || !password.value) {
    Swal.fire({
      icon: 'warning',
      title: 'กรุณากรอกข้อมูลให้ครบถ้วน'
    })
    return;
  }
  try{
    const res = await axios.post(`${import.meta.env.VITE_API}/api/login`,{
      username: username.value,
      password: password.value
    })

    const token = res.data.token
    if(res.data.success){
      localStorage.setItem('authtoken', token)
      const decoded = jwtDecode(token);
    }

    Swal.fire({
      icon: 'success',
      title: 'สำเร็จแล้ว',
      timer: '1500',
      showConfirmButton: false
    })

    switch(decoded.role){
      case 'user': router.push('/'); break;
      case 'officer': router.push('/'); break;
      case 'boss': router.push('/'); break;
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
