const express = require("express");
const router = express.Router();
const userSchema = require("../model/userModel")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get("/",(req,res)=>{
    res.send("server is working")
})

router.post("/register",(req,res,next)=>{
    if(req.body.password == req.body.confirmPassword){
        next()
    }else{
        console.log(req.body.password);
        console.log(req.body.confirmPassword)
        res.status(401).send("Wrong Password")
    }
}, (req,res) =>{
    const user = new userSchema(req.body)   
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password=hash;
    user.save(  (err,user) => {
        if(err){
            res.status(400).json(err)
        }else{
            res.send(200).json(user)
        }
    }  )
}  )


router.post("/login",(req,res,next)=>{
    const email = req.body.email
    const password=req.body.password
    let isAdmin=false;
    userSchema.findOne(  {email: email } , (err,user) => {
        if(err){
            res.json(err)
        }else{ 
            isAdmin=user.isAdmin;
            console.log(isAdmin)
           let hash=bcrypt.compareSync(password, user.password);
            if(hash){
                next()
            }
            else{
                res.status(401).send("invalid password")
            }   
        }
    }  )
}, (req,res) =>{
    const email = req.body.email;
    let isAdmin=false
    userSchema.findOne(  {email: email } , (err,user) => {
        if(err){
            res.json(err)
        }else{ 
            isAdmin=user.isAdmin;            
        }
    }  )
     const password = req.body
        let token = jwt.sign( { email : email,password:password , isAdmin :  isAdmin }  , '123abc'   );
        res.json(token)
}  )    

router.post("/users" , (req,res) =>{
    
    let token = req.headers.authorization   
    if( token == undefined ){
       return res.json("Login required")
    }else{
    try{
    var decoded = jwt.verify(token, '123abc');
    res.json(decoded)
    }catch(err){
        res.json(err)
    }
    }
    userSchema.find( {} , (err,users) => {
        if(err){
            res.json(err);
        }else{
            res.json(users);
        }
    }   )
} )


module.exports = router