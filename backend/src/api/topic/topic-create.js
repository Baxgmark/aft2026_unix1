const express = require('express');
const Router = express.Router();
const db = require('../../db/index.js');
const { validationResult ,  body} = require('express-validator');

Router.post('/addtopic', 
    [
        body('name').notEmpty().withMessage('กรุณากรอกหัวข้อ'),
        body('detail').notEmpty().withMessage('กรุณากรอกรายละเอียดหัวข้อ'),
        body('weight').notEmpty().withMessage('กรุณากรอกน้ำหนักหัวข้อ'),
          body('type').notEmpty().withMessage('กรุณาประเภทการประเมิน'),
          body('base_url').notEmpty().withMessage('กรุณาเพิ่มวิธีแนบหลักฐาน')
    ],async (req,res) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(401).json({
                success:false,
                message:error
            })
        }
        const { name , detail , weight , type , base_url } = req.body;
        try{
            const [rows] = await db.query('INSERT INTO topic (name , detail , weight , type , base_url) VALUES(?,?,?,?,?)',[name , detail , weight ,type ,base_url]);
                     console.log(name,detail,weight,type,base_url)
            return res.status(200).json({
                success:true,
                message:'เพิ่มหัวข้อสำเร็จ'
            })
  
        }catch(e){
            console.log(e)
            return res.status(500).json({
                success:false,
                message:'Server Error'
            })
        }
    
})


module.exports = Router