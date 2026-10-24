const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req,res,next){
    const token = req.headers['authorization'];
    const puretoken = token && token.split(' ')[1];
    console.log(token)
     if(!token || !puretoken) { return res.status(401).json({success:false , message:'token not found'})}
     try{
        const decode = jwt.verify(puretoken,process.env.JWT_SECERT);
         req.users = decode 
        next();
     }catch(e){
        console.log(e)
        return res.status(500).json({
            success:false,
            message:'server error'
        })
     }
};


module.exports = auth