const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("../models/user.model")
const userRouter=express.Router()

userRouter.post("/register",async(req,res)=>{
    const {name,email,gender,password,age,city,is_married}=req.body
    try {
       const user= await UserModel.findOne({email}) 
       if(user){
        return res.status(200).json({msg:"User already exist, Please login"})
       }
       bcrypt.hash(password,5,async(err,hash)=>{
        if(err){
            res.status(400).json({error:err})
        }else{
            const newUser=new UserModel({name,email,gender,password:hash,age,city,is_married})
            await newUser.save()
            res.status(200).json({msg:"Account created successfully",user:req.body})
        }
       })
       
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user= await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password, user.password, (err, result)=>{
                // result == true
                if(result){
                    const token=jwt.sign({userID:user._id,user:user.name},process.env.secretKey,{expiresIn:"7d"})
                    res.status(200).json({msg:"Login Success",token:token})
                }else{
                    res.status(400).json({error:err})
                }
            });
        }else{
            res.status(200).json({msg:"user not found please signup"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

module.exports={
    userRouter
}