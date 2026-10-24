const express = require('express');
const Router = express.Router();
const db = require('../../db/index.js');
const { validationResult ,  body} = require('express-validator');


Router.post('/bind-topic',
    [
        body('user_id').isEmpty().withMessage('กรุณาเพิ่มผู้ใช้'),
        body('topic_id').isEmpty().withMessage('กรุณาเพิ่มหัวข้อ')
    ], async (req ,res) => {
        try {
            const error = validationResult(req);
            if(!error){
                return res.status(400).json({
                    success:false,
                    message:error
                })
            }
            const {user_id , topic_id} = req.body;
            const [rows] = await db.query('SELECT * FROM user_topic WHERE user_id = ? AND topic_id = ? ', [user_id , topic_id])
            console.log(rows)
            if(rows.length > 0){
                return res.status(400).json({
                    success:false,
                    message:'ข้อมูลซ้ำ'
                })
             }
            const [rows1] = await db.query('INSERT INTO user_topic  (user_id , topic_id ) VALUES(?,?)',[user_id,topic_id])
            return res.status(200).json({
                success:true,
                message:'เพิ่มข้แมูลสำเร็จ'
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:'sercer error'
            })
        }
        
    }
)

module.exports = Router