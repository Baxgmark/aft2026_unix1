const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const PORT = process.env.PORT;
const fileuploads = require('express-fileupload');

app.use(cors())

app.use(fileuploads())

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use((req,res,next)=>{
    console.log('from', req.ip ,' req : ', '[' , req.method , ']', 'AT' , req.url)
    next();
})



const auth = require('./src/api/auth/register')
app.use('/api',auth)
const auth2 = require('./src/api/auth/login')
app.use('/api',auth2)
const topic = require('./src/api/topic/topic-create')
app.use('/api',topic)
const gettopic = require('./src/api/topic/get-topic')
app.use('/api',gettopic)
const binduser = require('./src/api/user_manager/bind-boss')
app.use('/api',binduser)
const bindtopic = require('./src/api/user_manager/bind-topic')
app.use('/api',bindtopic)
const cu = require('./src/api/user_manager/create-user')
app.use('/api',cu)
const gu = require('./src/api/user_manager/get-user')
app.use('/api',gu)
const rp = require('./src/api/user_manager/reset-pass')
app.use('/api',rp)
const ct = require('./src/api/topic/conf-time')
app.use('/api',ct)
const at = require('./src/api/topic/all-topic')
app.use('/api',at)


app.listen(PORT,()=>{
    console.log('server is starting at ...' , PORT)
})