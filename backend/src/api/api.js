const app = require('express');
const router = app.Router();
const db = require('../db/index.js');
router.get('/all',async(req,res) =>{
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

module.exports = router;