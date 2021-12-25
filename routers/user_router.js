// express framework
const express = require("express");

const cookieParser = require("cookie-parser");
app = express();
app.use(cookieParser());



// for hashing the password
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

// routing
const router = express.Router();

// import the user schema
const user = require("../models/user");

// import jwt auth
const {tokenGen} = require("../JWT/jwt");
const {verifyToken} = require("../JWT/jwt");

router.post("/register",async(req,res)=>{
    try{
        const plainPassword = req.body.password;          
        if (plainPassword.length < 5){
            return res.json({
                status: '500',
                error: 'Password too small. Should be atleast 6 characters'
            });
        }
        const hash = bcrypt.hashSync(plainPassword,salt);         // hashing password
        const user = new user({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        const saveUser = await user.save();
        res.status(201).send(saveUser);
    }catch(err){
        res.status(500).send(err);
    }
});

router.post("/login",async (req,res)=>{
    try{
        const existUser = await user.findOne({email:req.body.email});
        if(existUser){
            const checkUser = bcrypt.compareSync(req.body.password, existUser.password);
            if(checkUser){
                const token = tokenGen(existUser.email);
                return res
                .cookie("access_token", token, {
                  httpOnly: true,
                })
                .status(200)
                .json({ message: "Logged in successfully 😊 👌" });
            }else{
                res.send(req.body.password);
            }
        }
        else{
            res.send("User does not exist");
        }
    }catch(err){
        res.send(err);
    }
});

router.get("/protected",verifyToken,(req,res)=>{
    try{
        res.send("Protected");
    }catch(err){
        res.send(err);
    }
});

module.exports = router;