const jwt_ = require("jsonwebtoken");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


// generate token
const tokenGen = (email)=>{
    const token = jwt_.sign(
        {email},
        process.env.key,
        {expiresIn:"5minutes"}
    );
    return token;
};

// token validator
const tokenValidator = (token)=>{
    try{
        const data = jwt_.verify(token,process.env.KEY);
        return data;
    }
    catch{
        return false;
    }
};

//verify token
const verifyToken =  async function (req,res,next){
  
        const token = await req.cookies.access_token;
        const valid = tokenValidator(token);
        if(valid){
            return next();
        }
        else{
            res.send("Access Denied"); 
        }
};

module.exports.tokenGen = tokenGen;
module.exports.verifyToken = verifyToken;