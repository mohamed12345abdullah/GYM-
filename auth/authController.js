

import asyncHandler from '../utils/asyncHandler.js';
import User from '../users/userModel.js';
import Exercise from '../Exercises/exerciseModel.js';
import bcrypt from 'bcrypt';
import * as jwt from '../middlewares/jwt.js';



const login=asyncHandler(async(req,res)=>{
    const {email, phone, password}=req.body;
    const user=await User.findOne({$or:[{email},{phone}]});
    if(!user){
        throw new Error('User not found');
    }

   console.log(user);
    if(!user || ! bcrypt.compareSync(password,user.password)){
                throw new Error('Invalid email or password');

    }

     let token= jwt.generateToken({id:user._id});
     res.status(200).json({
        success:true,
        message:'User authenticated successfully',
        token,
     })
});


const changePassword=asyncHandler(async(req,res)=>{
   const user =req.user;
   const password=req.body.password;
   const hashedPassword = await bcrypt.hashSync(password, Number(process.env.saltRounds));
   user.password=hashedPassword;
   await user.save();
    res.status(200).json({
        success:true,
        message:'Password changed successfully',
        token:jwt.generateToken({id:user._id}),
    })
});


const verifyToken=asyncHandler(async(req,res)=>{
    const token=req.headers.authorization.split(' ')[1];
    const decoded=jwt.verifyToken(token);
    if(! decoded){
        throw new Error('Invalid token');
    }
    const user=await User.findById(decoded.id,'-password').populate('exercises');
    if(!user){
        throw new Error('User not found');
    }
    res.status(200).json({
        success:true,
        message:'Token verified successfully',
        data:user
    })
})

 

export{
    login,
    changePassword,
    verifyToken,
}