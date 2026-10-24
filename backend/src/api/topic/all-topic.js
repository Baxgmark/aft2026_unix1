const express = require('express');
const Router = express.Router();
const db = require('../../db/index.js');
const { validationResult ,  body} = require('express-validator');

const auth = require('../../middleware/auth.js')
Router.get('/userbindtopic',
    [
        body('user_id').isEmpty().withMessage('กรุณาเลือกผู้รับการประเมิน')
    ]
    ,auth,async (req,res) => {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({
                success:true,
                message:error
            })
        }
    const role = req.users.role
    console.log(role)
        const user_id = req.params
    try {
        const [rows] = await db.query('SELECT * FROM user_topic WHERE user_id =?',[user_id]);
        console.log(rows)
        return res.status(200).json({
            success:true,
            message:'success get data',
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

Router.get('/usertopic',
    auth,async (req,res) => {
    const id = req.users.id
    try {
        const [rows] = await db.query('SELECT u.id , t.* , tt.*  FROM users u JOIN user_topic t ON u.id = t.user_id  JOIN topic tt ON t.topic_id = tt.id WHERE u.id = ?',[id]);
        console.log(rows)
        return res.status(200).json({
            success:true,
            message:'success get data',
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

Router.post('/usersavetopic',
    auth,async (req,res) => {
    const id = req.users.id
    const { topic_id , self_score,base_url } = req.body
    console.log(req.body)
    console.log(self_score,base_url)
    try {
        const [rows] = await db.query('INSERT INTO self_answer (user_id , topic_id , self_score , base_url) VALUES(?,?,?,?)',[id,topic_id,self_score,base_url]);
        console.log(rows)
        return res.status(200).json({
            success:true,
            message:'success',
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

Router.post('/usersubmittopic',
    auth,async (req,res) => {
    const id = req.users.id
    try {
        const [rows] = await db.query('SELECT u.id , t.* , tt.*  FROM users u JOIN user_topic t ON u.id = t.user_id  JOIN topic tt ON t.topic_id = tt.id WHERE u.id = ?',[id]);
        console.log(rows)
        return res.status(200).json({
            success:true,
            message:'success get data',
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

Router.get('/allbindtopic',auth,async (req,res) => {
   
    const role = req.users.role
    console.log(role)
    try {
        const [rows] = await db.query('SELECT * FROM user_topic ');
        console.log(rows)
        return res.status(200).json({
            success:true,
            message:'success get data',
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


module.exports = Router