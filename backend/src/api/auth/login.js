const express = require('express');
const app = express();
const Router = express.Router();
const db = require('../../db/index.js');
const jwt = require('jsonwebtoken');
const hash = require('bcrypt')
const {validationResult , body} = require('express-validator');


Router.post('/login', 
    [
        body('username').notEmpty().withMessage('กรุณากรอก username'),
           body('password').notEmpty().withMessage('กรุณากรอก password'),
    ]
    ,async (req,res) => {
        const error = validationResult(req); 
        if (!error.isEmpty){
            return res.status(401).json({
                success:false,
                message:error
            })
        }
        const {username ,password} = req.body;
         console.log(username , password);
        try {

            const [rows] = await db.query('SELECT * FROM users WHERE username = ?',[username]);
            console.log(rows)
            const passhash = rows[0].password;
            console.log(passhash)
            if(passhash === null || 0 ){
                return res.status(400).json({
                    success:false,
                    message:'ไม่พบฐานข้อมูล'
                })
            }
            const composex = await hash.compare(password,passhash);

            if(composex){
                const token = jwt.sign(
                    {id:rows[0].id,
                    username:rows[0].username,
                    lastname:rows[0].lastname,
                    role:rows[0].role,
                    department:rows[0].department,
                    position:rows[0].position
                    },
                    process.env.JWT_SECERT,
                    {expiresIn:'10h'}
                )
                return res.status(200).json({
                    success:true,
                    token,
                    message:'login success'
                })
            }{
                return res.status(403).json({
                    success:false,
                    message:'รหัสผ่านผิด'
                })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:'Server Error'
            })
        }
    }
)



module.exports = Router