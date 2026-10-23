const express = require('express');
const app = express();
const Router = express.Router();
const db = require('../../db/index.js');
const jwt = require('jsonwebtoken');
const hash = require('bcrypt');
const {validationResult , body} = require('express-validator');


Router.post('/register', 
    [
        body('username').notEmpty().withMessage('กรุณากรอก username'),
         body('firstname').notEmpty().withMessage('กรุณากรอก firstname'),
          body('lastname').notEmpty().withMessage('กรุณากรอก lastname'),
           body('password').notEmpty().withMessage('กรุณากรอก password'),
            body('department').notEmpty().withMessage('กรุณากรอก department'),
           body('position').notEmpty().withMessage('กรุณากรอก position'),
    ]
    ,async (req,res) => {
        const error = validationResult(req); 
        if(!error.isEmpty()){
            return res.status(401).json({
                success: false,
                message:error
            })
        }
        const {username , firstname, lastname ,password , department ,position} = req.body;
         console.log(username , firstname , lastname , password);
         const hashpass = await hash.hash(password,10)
         console.log('hash',hashpass)
        try {
            const [rows] = await db.query('INSERT INTO users (username , firstname , lastname , password , department , position )VALUES(?,?,?,?,?,?)',[username,firstname,lastname,hashpass,department,position])
            return res.status(200).json({
                success:true,
                message:'register success'
            })
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