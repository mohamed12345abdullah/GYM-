import { log } from 'node:console';
import asyncHandler from '../utils/asyncHandler.js';
import bcrypt from 'bcrypt';

import User from './userModel.js';

 
 
const validateUser=(user)=>{
    
    //validate request body
    if (!user.name || !user.email || !user.password || !user.age || !user.gender || !user.phone) {
        return {
            success: false,
            message: 'All fields are required',
        };
     }
        
    //validate email
    if( !user.email.includes('@') ){          
        return {
            success: false,
            message: 'Email is not valid',
        };
    }

    //validate password
    if( user.password.length < 6 ){
        return {
            success: false,
            message: 'Password must be at least 6 characters',
        };
    }

    return {
        success: true,
        message: 'User is valid',
    };

}

const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, age, gender, phone } = req.body;


    const validationResult = validateUser({ name, email, password, age, gender, phone });
    if (!validationResult.success) {
        throw new Error(validationResult.message);
        return;
    }
 

    log('User is valid');
    const hashedPassword = await bcrypt.hashSync(password, Number(process.env.saltRounds));
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        age,
        gender,
        phone,
    });
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        user,
    });
});




const editUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
        return ;
    }
    const { name, email, age, gender, phone } = req.body;

    const validationResult = validateUser({ name, email, password:1234567, age, gender, phone });
    if (!validationResult.success) {
        throw new Error(validationResult.message);
        return;
    }



    //update user
    existingUser.name = name;
    existingUser.email = email;
    existingUser.age = age;
    existingUser.gender = gender;
    existingUser.phone = phone;
    await existingUser.save();  
    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: existingUser,
    });
});




const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
        return ;
    }
    const user = await User.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        user,
    });
});



const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        users,
    });
});



const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
        return ;
    }
    res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        user,
    });
});



const changePassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existingUser = await User.findById(id);
    if (!existingUser) {
        throw new Error('User not found');
        return ;
    }
    const { password } = req.body;
    if (!password) {
        throw new Error('Password is required');
        return;
    }

    const hashedPassword = await bcrypt.hashSync(password, Number(process.env.saltRounds));
    existingUser.password = hashedPassword;
    await existingUser.save();
    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        user: existingUser,
    });
})



export  {
    createUser,
    editUser,
    deleteUser,
    getAllUsers,
    getUserById,
    changePassword,
}
