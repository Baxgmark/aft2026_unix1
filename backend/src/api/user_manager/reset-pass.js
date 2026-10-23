const express = require('express');
const Router = express.Router();
const db = require('../../db/index.js');
const { validationResult ,  body} = require('express-validator');
const bcrypt = require('bcrypt');
Router.post('/reset-pass',
    [
        body('username').isEmpty().withMessage('กรุณากรอกชื่อผู้ใช้'),
                body('password').isEmpty().withMessage('กรุณากรอกรหัส่ผ่านใหม่ผู้ใช้'),

    ],
    async (req,res) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({
                success:false,
                message:error
            })
        }
        const {username , password} = req.body
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE username = ?',[username]);
            if(rows === null || 0  ){
                    return res.status(400).json({
                        success:false,
                        message:'ไม่พบผู้ใช้่'
                    })
                }
                const hashpass = await bcrypt.hash(password,10)
            const [row2] = await db.query('UPDATE user SET password = ? WHERE username = ?',[hashpass,username])
             return res.status(200).json({
                success:true,
                message:'อัพเดตรหัสสำเร็จ'
             })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success:false,
                message:'server error'
            })
        }
     
        
    }
)


module.exports = Router