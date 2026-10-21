<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router'

const router = useRouter()
const status = ref('loading....')
const groupquizlist = ref([])

const getdata = async () => {
    try{
        const res = await async(`${import.meta.env.VITE_API}/api/getuser`)
        const groups = {}
    }
}
</script>