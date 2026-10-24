const express = require('express');
const Router = express.Router();
const db = require('../../db/index.js');
const auth = require('../../middleware/auth.js')
Router.get('/alltopic',auth,async (req,res) => {
    const role = req.users.role
    console.log(role)

    try {
        const [rows] = await db.query('SELECT * FROM topic');
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