










<script setup>
import { ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const topics = ref([])
const types = ref([
    {id:'1',label:'1-4 คะแนน'},
    {id:'2',label:'ผ่าน / ไม่ผ่าน'}
])

const createtopic = () => ({
    topic_name: '',
    topic_detail: '',
    topic_weight: '',
    topic_url: '',
    quiz:[]
})

const createquiz = () => ({
    text: '',
    type: '1'
})

const addtopic = () => {
    topics.value.push(createtopic())
}
const removetopic = (topicindex) => {
    topics.value.splice(topicindex,1)
}
const addquiz = (topicindex) => {
    topics.value[topicindex].quiz.push(createquiz())
}
const removequiz = (topicindex,quizindex) => {
    topics.value[topicindex].quiz.splice(quizindex,1)
}

const submit = async () => {
    try{
        const res = await axios.post(`${import.meta.env.VITE_API}/api/submit`,{
            topics: topics.value
    })
    if(res.data?.success){
        Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลสำเร็จ'
        })
    }
    } catch(e){
        console.error(e)
    }
}
</script>

<template>
    <div>
        <h1>
            officer view
        </h1>
    </div>
    </template>