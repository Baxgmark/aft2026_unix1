const express = require('express');
const Router = express.Router();
const db = require('../../db/index.js');
const auth = require('../../middleware/auth.js');
const { body, validationResult } = require('express-validator');

Router.post('/conftime',
    async (req,res) => {
     
        const {time1 , time2} = req.body
        console.log(req.body)
    try {
        const [rows2] = await db.query('SELECT * FROM timetodo');
        if(rows2.length > 0){
            return res.status(400).json({
                success:false,
                message:'ห้ามส่งข้อมูลเวลามากกว่า 1 ครั้ง กรุณาแก้ไข'
            })
        }
        const [rows] = await db.query('INSERT INTO timetodo (time_start, time_end) VALUES(?,?)',[time1 , time2])
        return res.status(200).json({
            success:true,
            message:'success'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'error server'
        })
    }
})

Router.get('/conftime', async (req,res) => {
    try {
        const [rows] = await db.query('SELECT * FROM timetodo');
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

Router.put('/conftime',async (req,res) => {
     const { time1 , time2 } = req.body;
    try {
        if (time1) await db.query('UPDATE timetodo SET time_start = ?', [time1]);
if (time2) await db.query('UPDATE timetodo SET time_end = ?', [time2]);
        return res.status(200).json({
            success:true,
            message:'ok'
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