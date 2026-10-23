const express = require('express');
const Router = express.Router();
const db = require('../../db/index.js');
const { validationResult ,  body} = require('express-validator');
const auth = require('../../middleware/auth.js')

Router.post('/bind-boss',
    [
        body('user_id').isEmpty().withMessage('กรุณาเพิ่มผู้ใช้'),
        body('boss_id').isEmpty().withMessage('กรุณาเพิ่มหัวข้อ')
    ], async (req ,res) => {
        try {
            const error = validationResult(req);
            if(!error){
                return res.status(400).json({
                    success:false,
                    message:error
                })
            }
            const {user_id , boss_id} = req.body;
            const [rows] = await db.query('SELECT * FROM user_boss WHERE user_id = ? AND boss_id = ? ', [user_id , boss_id])
            if(rows.length > 0){
                return res.status(400).json({
                    success:false,
                    message:'ข้อมูลซ้ำ'
                })
            }
            const [rows1] = await db.query('INSERT INTO user_boss  (user_id , boss_id ) VALUES(?,?)',[user_id,boss_id])
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

Router.get('/bind-boss',async (req,res) => {
    try {
        const [rows] = await db.query('SELECT * FROM user_boss');
        return res.status(200).json({
            success:true,
            message:'ok',
            rows
        })
    } catch (error) {
           console.log(error)
            return res.status(500).json({
                success:false,
                message:'sercer error'
            })
    }
})

Router.get('/userinreview',auth,async (req,res) => {
    const id = req.users.id
    try {
        const [rows] = await db.query('SELECT * FROM user_boss WHERE boss_id =? AND is_active = ?',[id, 1]);
        console.log(rows)
        if(rows.length === 0){
            return res.status(400).json({
                success:false,
                message:'ไม่มีผู้ที่ต้องประเมินหรือผู้ที่รับการประเมินยังไม่สำเร็จ'
            })
        }
        return res.status(200).json({
            success:true,
            message:'ok',
            rows
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'server error'
        })
    }
})

Router.get('/userdata',async (req,res) => {
    const {user_id} = req.body
    try{

    }catch(error){
      console.log(error)
        return res.status(500).json({
            success:false,
            message:'server error'
        })
    }
})

module.exports = Router