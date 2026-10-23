const app = require('express');
const router = app.Router();
const db = require('../../db/index.js');
const auth = require('../../middleware/auth.js')
const hash = require('bcrypt')
router.get('/getuser',async(req,res) =>{
    const [data] = await db.query(`SELECT * FROM users WHERE role =? `,['user']);
    console.log(data)
    if (data === 0 || null){
        console.log('data not found')
    } {
    return res.status(200).json({
        success:true,
        message:data
    })
}
})

router.get('/getboss',async(req,res) =>{
    const [data] = await db.query(`SELECT * FROM users WHERE role = ?`,['boss']);
    console.log(data)
    if (data === 0 || null){
        console.log('data not found')
    } {
    return res.status(200).json({
        success:true,
        message:data
    })
}
})

router.get('/getalluser',async(req,res) =>{
    const [data] = await db.query(`SELECT * FROM users`);
    console.log(data)
    if (data === 0 || null){
        console.log('data not found')
    } {
    return res.status(200).json({
        success:true,
        message:data
    })
}
})

router.put('/updateuser',auth,async (req,res) => {
    try {
        const {id , firstname , lastname , password , role , department , position} = req.body
        console.log(id , firstname , lastname , password , role , department , position)
        if(firstname){const [rows1] = await db.query('UPDATE users SET firstname = ? WHERE id =?',[firstname , id])}
                if(lastname){const [rows1] = await db.query('UPDATE users SET lastname = ? WHERE id =?',[lastname , id])}
              
                        if(password){
                              const hashpass = await hash.hash(password,10)
                              console.log(hashpass)
                            const [rows1] = await db.query('UPDATE users SET password = ? WHERE id =?',[hashpass , id])}

                                if(role){const [rows1] = await db.query('UPDATE users SET role = ? WHERE id =?',[role , id])}
                                   if(department){const [rows1] = await db.query('UPDATE users SET department = ? WHERE id =?',[department , id])}
                                      if(position){const [rows1] = await db.query('UPDATE users SET position = ? WHERE id =?',[position , id])}
                                     
                                      return res.status(200).json({
                                        success:true,
                                        message:'update success'
                                      })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'server error'
        })
    }
})

module.exports = router;